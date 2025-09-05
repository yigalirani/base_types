export type s2t<T> = Record<string, T>
export type s2u = Record<string, unknown>
export type p2u = Record<PropertyKey, unknown> 
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
  return value != null &&typeof value === 'object' && value.constructor === Object;

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
