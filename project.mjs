import { field, table, column, view, metric, item, csvArtifact, textArtifact, summary } from './lib/product-kit.mjs';
export const product = {
  category:'Design system review',projectNoun:'Palette project',runLabel:'Audit and repair palette',
  outcome:'Maintain a token palette and usage pairs, preserve locked colors, review all changes and export a CSS token patch.',
  fields:[field('tokens','Color tokens','dictionary',{valueType:'color',keyLabel:'Token name',valueLabel:'Opaque sRGB hex'}),
    table('pairs','Declared text usages',[column('foreground','Text token'),column('background','Surface token'),column('textClass','Text class','choice',{choices:['normal','large']})]),field('locked','Locked tokens','list')],
  describe(result) {
    return summary([metric('Token changes',result.changes.length),metric('Passing pairs',result.pairs.filter(p=>p.status==='pass').length),metric('Unresolved pairs',result.pairs.filter(p=>p.status!=='pass').length)],[
      view('Token patch',[column('token','Token'),column('before','Before'),column('after','After')],result.changes),
      view('Whole-usage revalidation',[column('foreground','Text'),column('background','Surface'),column('ratio','Contrast ratio'),column('target','Required'),column('status','Result')],result.pairs),
    ],[...result.changes.map(c=>item(`token:${c.token}`,`Review ${c.token}`,`${c.before} → ${c.after}`,!/^[a-zA-Z_][\w-]*$/.test(c.token))),...result.pairs.filter(p=>p.status!=='pass').map((p,i)=>item(`pair:${i}`,`Unresolved ${p.foreground} / ${p.background}`,p.status,true))],{type:'palette',tokens:result.tokens,pairs:result.pairs});
  },
  artifacts(result) {
    const safe = /^[a-zA-Z_][\w-]*$/;
    const css = result.changes.filter(c=>safe.test(c.token)).map(c=>`  --${c.token}: ${c.after};`).join('\n');
    return [textArtifact('css','Changed color tokens','css','text/css',`/* Review the companion audit before applying. Invalid CSS token names are omitted. */\n:root {\n${css}\n}\n`),csvArtifact('contrast','Contrast audit',[column('foreground','Text token'),column('background','Surface token'),column('ratio','Ratio'),column('target','Required'),column('status','Result')],result.pairs)];
  },
};
