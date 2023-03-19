onload = function () { 
    let canvasEdit = document.getElementById("canvasEdit"); 
    let context = canvasEdit.getContext("2d");
      
    let btnUpload = document.getElementById("upload");
    let btnflipHorizontal = document.getElementById("flipHorizontal");
    let btnflipVertical = document.getElementById("flipVertical");
    let btnrotateLeft = document.getElementById("rotateLeft");
    let btnrotateRight = document.getElementById("rotateRight");
    let btnresizeImg = document.getElementById("resizeImg");
    let btngreyscaleImg = document.getElementById("greyscaleImg");
    let btnsaveImg = document.getElementById("saveImg");

    function setImageData(dataOfimage, imageHeight, imageWidth) { 
        let ArrLength = imageHeight*imageWidth*4;
        const Image = Array.from({ length: ArrLength });
        for(let a = 0;a < imageHeight; a++) { 
            for (let b = 0; b < imageWidth; b++) {
                for (let c = 0; c < 4; c++) {
                    Image[( a*imageWidth + b ) * 4 + c ] = dataOfimage[a][b][c];                                           
                }
            }
        }
        let imgdata = context.createImageData(imageWidth, imageHeight);
        imgdata.data.set(Image);
        canvasEdit.width = imageWidth; 
        canvasEdit.height = imageHeight;
        context.putImageData(imgdata, 0, 0);
    }

    function getImageDataArr(imageHeight, imageWidth) {
        let imageData = context.getImageData(0, 0, imageWidth, imageHeight).data;
        const RGBImage = [];
        for(let a=0;a<imageHeight;a++){ 
            let row = [];                                                  
            for(let b=0;b<imageWidth;b++){                                 
                let pixel = [];                                              
                for(let c=0;c<4;c++){                                       
                    pixel.push( imageData[ ( a*imageWidth + b ) * 4 + c ] );
                }                                                           
                row.push(pixel);                                          
            }                                                             
            RGBImage.push(row);                                             
        }                                                                     
        return RGBImage;                                                    
    }

    btnUpload.addEventListener('click', () => { 
     const uploadImage = document.createElement('input');
            uploadImage.type = "file";
            uploadImage.click(); 
            uploadImage.onchange = function() { 
                                          
                const img = document.createElement('img');
                img.onload = () => {
                    canvasEdit.width = img.width;
                    canvasEdit.height = img.height;
                    context.drawImage(img, 0,0);
                };
                img.onerror = () => {
                    alert("This file you are trying to upload is not an image file!"); 
                };
                img.src = URL.createObjectURL(this.files[0]);
            };      
      });

    btnflipHorizontal.addEventListener('click', () => { 
        let image = getImageDataArr(canvasEdit.height,canvasEdit.width);

            for(let a=0;a<canvasEdit.height;a++){                    
                for(let b=0;b<Math.floor(canvasEdit.width/2);b++){   
                    let temp = image[a][b];                          
                    image[a][b] = image[a][canvasEdit.width-1-b];    
                    image[a][canvasEdit.width-1-b] = temp;           
                }                                                   
            }                                                       
            setImageData(image, canvasEdit.height, canvasEdit.width) 
            
         });
        
    btnflipVertical.addEventListener('click', () => { 
            let image = getImageDataArr(canvasEdit.height, canvasEdit.width); 

            for(let a=0;a<Math.floor(canvasEdit.height/2);a++){      
                for(let b=0;b<canvasEdit.width;b++){                
                    let temp = image[a][b];                          
                    image[a][b] = image[canvasEdit.height-1-a][b];   
                    image[canvasEdit.height-1-a][b] = temp;         
                }                                                    
            }                                                       
            setImageData(image, canvasEdit.height, canvasEdit.width);
            
         });

    btnrotateLeft.addEventListener('click', () => {
            let image = getImageDataArr(canvasEdit.height, canvasEdit.width); 

            let imageToLeft = [];                                            
            for(let a=canvasEdit.width-1;a>=0;a--){                           
                let row = [];                                                  
                for(let b=0;b<canvasEdit.height;b++){                          
                    row.push(image[b][a]);                                    
                }                                                             
                imageToLeft.push(row);                                                           
            }                                                                  
            setImageData(imageToLeft, canvasEdit.width, canvasEdit.height);     
            
         });  

    btnrotateRight.addEventListener('click', () => { 
            let image = getImageDataArr(canvasEdit.height, canvasEdit.width); 

            let imageToRight = [];                                           
            for(let a=0;a<canvasEdit.width;a++){                                 
                let row = [];                                                   
                for(let b=canvasEdit.height-1;b>=0;b--){                                     
                    row.push(image[b][a]);                                              
                }                                                                            
                imageToRight.push(row);                                            
            }                                                                                              
            setImageData(imageToRight, canvasEdit.width, canvasEdit.height);     
            
         });

    btnresizeImg.addEventListener('click', () => {
            let image = getImageDataArr(canvasEdit.height,canvasEdit.width); 

            let inputSize = prompt('Current Width : '+canvasEdit.width + '\n' + 'Current Height : '              
            +canvasEdit.height + '\n' + 'Give the new width and height in a space separated manner').split(' ');
            if(inputSize.length!==2){ 
                alert('Incorrect dimensions in input'); 
                return;
            }
            let inputImgWidth = parseInt(inputSize[0]); 
            let inputImgHeight = parseInt(inputSize[1]);
            if(isNaN(inputImgWidth) || isNaN(inputImgHeight)){
                alert('Input is not a proper number');         
                return;
            }

            let heightRatio = canvasEdit.height/inputImgHeight; 
            let widthRatio = canvasEdit.width/inputImgWidth; 

            let editedImage = [];                                                          
            for(let a=0;a<inputImgHeight;a++){                                             
                let row = [];                                                              
                for(let b=0;b<inputImgWidth;b++){                                                   
                    row.push(image[Math.floor(a*heightRatio)][Math.floor(b*widthRatio)]);  
                }                                                                           
                editedImage.push(row);                                                                  
            }                                                                                           
            setImageData(editedImage, inputImgHeight, inputImgWidth);                         
         });

    btngreyscaleImg.addEventListener('click', () => {
            let image = getImageDataArr(canvasEdit.height, canvasEdit.width);

            for(let a=0;a<canvasEdit.height;a++){                                       
                for(let b=0;b<canvasEdit.width;b++){                                   
                    let pixel = image[a][b];                                           
                    let grey = Math.floor(0.3*pixel[0]+0.59*pixel[1]+0.11*pixel[2]);   
                    image[a][b][0] = image[a][b][1] = image[a][b][2] = grey;           
                }                                                                         
            }                                                                         
            setImageData(image, canvasEdit.height, canvasEdit.width);                  
            
         });

    btnsaveImg.addEventListener('click', () => {
            const image = canvasEdit.toDataURL(); 
            const link = document.createElement('a');
            link.download = 'editedImage.png';
            link.href = image;
            link.click(); 
         });
};