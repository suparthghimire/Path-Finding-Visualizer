function ap() {
  for (let i = 0; i < 5; i++) {
    a(i).then((x) => {
      if (i == 4) console.log(x);
    });
  }
}
ap();

function a(i) {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(true), 200 * i);
  });

  return promise;
}
