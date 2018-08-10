/**
 * @interface SMP
 * @description Base class for all social media platforms.
 * This will be used for achieving runtime polymorphism and combining the end result
 * @export SMP
 */
interface SMP {
  searchByKeyword(query: JSON, resolve, reject);
  normalizeResult(data: JSON);
}

export default SMP;
