async function getOne() {
    setTimeout(() => {}, 100);
    return 1; 
}

async function onePlusOne() {
    let promise = await getOne();
    promise.then(result => {
        return result + 1;
    });
    console.log("finished");
}

let promise = onePlusOne();
//promise.then(result => console.log(result));