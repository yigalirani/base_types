export type s2t<T> = Record<string, T>
export type s2u = Record<string, unknown>
export type p2u = Record<PropertyKey, unknown> 
export const green='\x1b[40m\x1b[32m'
export const red='\x1b[40m\x1b[31m'
export const yellow='\x1b[40m\x1b[33m'

export const reset='\x1b[0m'
export function nl<T>(value: T | null | undefined): T {
  //todo:check only active on debug mode
  //return value
  if (value === null || value === undefined) {
    throw new Error('Value cannot be null or undefined')
  }
  return value
}
export type Key = number | string //should i use properykey for this?
export type Atom = number | string | boolean 
export function is_atom(x: unknown): x is Atom {
  if (x == null) return false
  return ['number', 'string', 'boolean'].includes(typeof x)
}
export function is_key(x: unknown): x is Key {
  if (x == null) return false
  return ['number', 'string'].includes(typeof x)
}
export function is_atom_ex(v: unknown, place: string, k = ''): v is Atom {
  if (is_atom(v)) return true
  console.warn('non-atom', place, k, v)
  return false
}
export function get_error(x:unknown){
  if (x instanceof Error)
    return x
  const str = String(x)
  return new Error(str)
}
export function is_object<T extends object=s2u>(value: unknown): value is T{
  if (value == null) return false;
  
  // Accept objects and functions
  if (typeof value !== 'object' && typeof value !== 'function') return false;
  
  // Exclude known non-object types
  if (Array.isArray(value)) return false;
  if (value instanceof Set) return false;
  if (value instanceof Map) return false;
  
  return true;
}
export function has_key(obj: unknown, k: string): boolean {
  if (!is_object(obj)) return false
  return k in obj
}
export function* objects_only(ar:unknown[]){
  for (const item of ar)
    if (is_object(item))
      yield item
}

export function has_keys(obj: unknown, keys: string[]): boolean {
  if (!is_object(obj)) return false
  for (const k of keys) if (k in keys) return true
  return false
}
export type strset = Set<string>
export type s2num = Record<string, number>
export type s2s = Record<string, string>
export type num2num = Record<number, number>

export function pk<T, K extends keyof T>(obj: T | undefined, ...keys: K[]): Pick<T, K> {
  const ret: Record<PropertyKey,unknown> = {} 
  keys.forEach((key) => {
    ret[key] = obj?.[key]
  })
  return ret as Pick<T, K> 
}
export function is_promise<T=void>(value: unknown): value is Promise<T> { ///ts(2677)
  if (!is_object(value))
    return false

  const ans=typeof (value.then)==='function'
  return ans
}
type MaybePromise<T>=T|Promise<T>
async function resolve_maybe_promise<T>(a:MaybePromise<T>){
  if (is_promise(a))
    return await a
  return a
}
      
export interface Test{
  k?:string,
  v?:Atom,
  f:()=>MaybePromise<Atom>
}

export async function run_tests(...tests: Test[]) {
  let passed = 0
  let failed = 0
  
  for (const {k,v,f} of tests) {
    const ek=function(){
      if (k!=null)
        return k
      const fstr=String(f)
      const match=fstr.match(/(\(\) => )(.*)/)
      if (match?.length===3)
        return match[2]
      return
    }()
    try {
      const ret=f()
      const effective_v=v??true
      const resolved = await resolve_maybe_promise(ret)
      if (resolved===effective_v){
        console.log(`✅ ${ek}: ${green}${effective_v}${reset}`)
        passed++
      } else {
        console.error(`❌ ${ek}:expected ${yellow}${effective_v}${reset}, got ${red}${resolved}${reset}`)
        failed++
      }
    } catch (err) {
      console.error(`💥 ${ek} threw an error:`, err)
      failed++
    }
  }
  if (failed===0)
    console.log(`\nSummary:  all ${passed} passed`)  
  else
    console.log(`\nSummary:  ${failed} failed, ${passed} passed`)  
}


export function getCommonPrefix(paths: string[]): string {
  if (paths.length === 0) return "";
  if (paths.length === 1) return paths[0];

  // Split each path into parts (e.g., by "/" or "\\")
  const splitPaths = paths.map(p => p.split(/[\\/]+/));

  const commonParts: string[] = [];
  const first = splitPaths[0];

  for (let i = 0; i < first.length; i++) {
    const part = first[i];
    if (splitPaths.every(p => p[i] === part)) {
      commonParts.push(part);
    } else {
      break;
    }
  }

  // Join back with "/" (or use path.join for platform-specific behavior)
  return commonParts.join("/");
}


async function get_node(){
  if (typeof window !== "undefined") {
    throw new Error("getFileContents() requires Node.js");
  }
  const path = await import("node:path");
  const fs = await import("node:fs/promises");
  return {fs,path}  
}
export async function mkdir_write_file(filePath:string,data:string){
  const {path,fs}=await get_node()
  const directory=path.dirname(filePath);
  try{
    await fs.mkdir(directory,{recursive:true});
    await fs.writeFile(filePath,data);
    console.log(`File '${filePath}' has been written successfully.`);
  } catch (err){
    console.error('Error writing file',err)
  }
}
export async function read_json_object(filename:string,object_type:string){
  const {fs}=await get_node()
  try{
    const data=await fs.readFile(filename, "utf-8");
    const ans=JSON.parse(data) as unknown
    if (!is_object(ans))
      throw `not a valid ${object_type}`
    return ans
  }catch(ex:unknown){
    console.warn(`${filename}:${get_error(ex)}.message`)
    return undefined
  }
}
export function is_string_array(a:unknown):a is string[]{
  if (!Array.isArray(a))
    return false
  for (const x of a)
    if (typeof x!=='string')
      return false
  return true  
}