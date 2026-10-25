import data from '../data/site.json';
const state={data,loading:false,error:false,retry:()=>{}};
export default function useSiteData(){return state;}
