export const fetcher = <T>(url:string, opts?:RequestInit) =>
    fetch(url, opts).then(r => {
      if (!r.ok) throw new Error("API Error");
      return r.json() as Promise<T>;
    });
  