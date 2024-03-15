const fs = require('fs/promises');
const path = require('path');


(async () => {
    /*
    fs.watch is an asynchronous generator function. Any event constantly yeilds promises
    */
    const watcherObj = fs.watch('./CommandFile.txt');

    //The filehandler gains control over the file and can now manipulate the file
    const fileHandler = await fs.open('./sample.txt', 'r');

    const createCommand = "Create File";
    const deleteCommand = "Delete File";
    
    //The for await syntax here allows us to read the results as they
    //are resolved in an asynchronous manner

    fileHandler.on("change", async () => {
        // console.log((await fs.readFile('./sample.txt')).toString('utf-8'));
        console.log("There has been a change in the file");

        let myBuf = Buffer.alloc((await fileHandler.stat()).size);
        let offsetVal = 0;
        let length = myBuf.length;
        let readPos = 0;


        await fileHandler.read(
            myBuf,
            offsetVal,
            length,
            readPos
        );
        let command = myBuf.toString('utf-8');

        if (command.includes(createCommand)) {
            
            let filePath = command.substring(createCommand.length + 1);
            try {
                //if the read works then no need to create, else add logic in the try
                const testOpen = await fs.open(filePath, 'r');
                testOpen.close();
                
            } catch(error){
                const needOpen = await fs.open(filePath, 'w');
                needOpen.close();
            }
        } else if (command.includes(deleteCommand)){
            let filePath = command.substring(deleteCommand.length + 1);
            try {
                //need to make sure file exists
                const testOpen = await fs.open(filePath, 'r');
                testOpen.close();
                //if opens
                await fs.rm(filePath);

                

            } catch(error){
                console.log(`No such file ${filePath}`);
            }
        }
        else {
            console.log("Not a valid command!");
        }

    });

    for await (const event of watcherObj) {
        fileHandler.emit("change");
    }
})()







