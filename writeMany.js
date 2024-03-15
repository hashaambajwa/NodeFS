const fs = require('fs/promises');

console.time("writeMany");
(async () => {
    const myHandler = await fs.open('./canvas.txt', 'w');
    const myBuf = Buffer.from("a");
    for (let i = 0; i < 1000000; i++){
        await myHandler.write(myBuf);
    }
    myHandler.close();
    console.timeEnd("writeMany");
})()
