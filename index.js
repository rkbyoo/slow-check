
//here process.argvs parse the commands in 3 parts , node executable path, path of js file which runs and then at last it prints the 
console.log(process.argv);

//lets understand what is spawn and how it works

const {spawn}=require('child_process');


const start=Date.now();

const child=spawn('node',['-v'],{shell:true}); 

child.stdout.on('data',d=>process.stdout.write(d));
child.stderr.on('data',d=>process.stderr.write(d));

child.on('close',(code)=>{
    const end=Date.now();
    console.log('---');
    console.log('Exit code:',code);
    console.log('Time:',start-end,'ms')
});


