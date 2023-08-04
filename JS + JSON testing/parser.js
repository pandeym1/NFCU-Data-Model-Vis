var file;

  async function fun() {
    return fetch('./ACCT Domain properties - 07032023 - Results.json').then(res => res.json());
  }

file = fetch('./ACCT Domain properties - 07032023 - Results.json').then(res => res.json());

console.log(file);