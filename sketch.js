let sourceImg=null;
let maskImg=null;
let renderCounter=0;
let curLayer = 0;

// change these three lines as appropiate
let sourceFile = "input_6.jpg";
let maskFile   = "mask_6.png";
let outputFile = "output_6.png";

function preload() {
  sourceImg = loadImage(sourceFile);
  maskImg = loadImage(maskFile);
  //console.log(p5.Renderer2D);
}

function setup () {
  let main_canvas = createCanvas(1920, 1080);
  main_canvas.parent('canvasContainer');

  imageMode(CENTER);
  noStroke();
  background(255, 255, 255);
  sourceImg.loadPixels();
  maskImg.loadPixels();
  colorMode(HSB);
  maskCenterSearch(20);
}

//------------------------------- Canvas Size Setup -------------------------------
let X_STOP = 1920;
let Y_STOP = 1080;
let OFFSET = 10;

//------------------------------ Blob Tracking Setup ------------------------------
function maskCenterSearch(min_width) {
  let max_up_down = 0;
  let max_left_right = 0;
  let max_x_index = 0;
  let max_y_index = 0;
  let track_X_STOP = 1820;

  // first scan all rows top to bottom
  print("Scanning mask top to bottom...")
  for(let j=0; j<Y_STOP; j++) {
    // look across this row left to right and count
    let mask_count = 0;
    for(let i=0; i<track_X_STOP; i++) {
      let mask = maskImg.get(i, j);
      if (mask[1] > 128) {
        mask_count = mask_count + 1;
      }
    }
    // check if that row sets a new record
    if (mask_count > max_left_right) {
      max_left_right = mask_count;
      max_y_index = j;
    }
  }

  // now scan once left to right as well
  print("Scanning mask left to right...")
  for(let i=0; i<track_X_STOP; i++) {
    // look across this column up to down and count
    let mask_count = 0;
    for(let j=0; j<Y_STOP; j++) {
      let mask = maskImg.get(i, j);
      if (mask[1] > 128) {
        mask_count = mask_count + 1;
      }
    }
    // check if that row sets a new record
    if (mask_count > max_up_down) {
      max_up_down = mask_count;
      max_x_index = i;
    }
  }

  print("Scanning mask done!")
  if (max_left_right > min_width && max_up_down > min_width) {
    maskCenter = [max_x_index, max_y_index];
    maskCenterSize = [max_left_right, max_up_down];
  }
}
//---------------------------------------------------------------------------------

//--------------------------------- Star Shape Setup ------------------------------
function radialGradient(sX, sY, sRad, eRad, colS, colE, RCX, RCY){ //RC: Relative Coordinates, radial gradient's center relative to the circle's center
  let gradient = drawingContext.createRadialGradient(sX+RCX, sY+RCY, sRad, sX+RCX, sY+RCY, eRad);
  gradient.addColorStop(0, colS)
  gradient.addColorStop(1, colE)

  drawingContext.fillStyle = gradient; 
}

function starShape (x, y, size, hue, saturation, brightness) {
  let colour = color(hue, saturation, brightness);
  let transparent = color(hue, saturation, brightness, 0);
  radialGradient(x, y,  0, size/4, colour, transparent, 0, 0);
  ellipse(x, y,  size, size);
}
function starShapeTop (x, y, size, hue, white, light) {
  let colourLight = color(hue, white, light, 0.5);
  let transparentLight = color(hue, white, light, 0);
  radialGradient(x, y,  0, size/8, colourLight, transparentLight, 0, 0);
  ellipse(x, y,  size, size);
}
//---------------------------------------------------------------------------------

function draw () {
  angleMode(DEGREES);
  if (curLayer == 0) {
    //-------------------- Colour/Saturation Change, Warp and Blur --------------------
      let num_lines_to_draw = 40;
      // get one scanline
      for(let j=renderCounter; j<renderCounter+num_lines_to_draw && j<Y_STOP; j++) {
          for(let i=0; i<X_STOP; i++) {
            colorMode(RGB);
            let pix = sourceImg.get(i, j);
            let mask = maskImg.get(i, j);

            //--------------------------------- Warp Effect -----------------------------------
            let warpOffset = 5;
            let wave = sin(j*10);
            let slip = map(wave, -1, 1, -warpOffset, warpOffset);

            // //--------------------------------- Blur Effect -----------------------------------
            // pix == [0, 0, 0, 255];
            // let sum_rgb = [0, 0, 0]
            // let num_cells = 0;
            // for(let wx=-OFFSET;wx<OFFSET;wx++){
            //   for (let wy=-OFFSET;wy<OFFSET;wy++) {
            //     let pix = sourceImg.get(i+wx, j+wy);
            //     for(let c=0; c<3; c++) {
            //       sum_rgb[c] += pix[c];
            //     }
            //     num_cells += 1;
            //   }
            // }
            // for(let c=0; c<3; c++) {
            //   pix[c] = int(sum_rgb[c] / num_cells);
            // }        
            // //------------------------------- End Blur Effect ---------------------------------

            //--------------------------- Colour/Saturation Change ----------------------------
            // create a color from the values (always RGB)
            let col = color(pix);
            colorMode(HSB, 360, 100, 100);
            let h = hue(col);
            let s = saturation(col);
            let b = brightness(col);

            if(mask[0] > 128) {
              // draw the full pixels
              let new_hue = map(h, 0, 220, 320, 220);              
              let new_sat = map(s, 0, 80, 60, 60);
              let new_brt = map(b, 0, 50, 100, 50);
              let new_col = color(new_hue, new_sat, new_brt);
              set(i+slip, j, new_col); 
            }
            else {
              let new_hue = map(h, 0, 200, 225, 250);
              let new_brt = map(b, 0, 18, 18, 18);
              let new_col = color(new_hue, 90, new_brt);
              set(i+slip, j, new_col);
            }      
          }
        }
        renderCounter = renderCounter + num_lines_to_draw;
        updatePixels();
    //---------------------------------------------------------------------------------
  }
  else if (curLayer == 1){
    //--------------------------------- Small Stars -----------------------------------
    for(let i=0;i<2000;i++) {
      colorMode(RGB);
      let x = floor(random(sourceImg.width));
      let y = floor(random(sourceImg.height));
      let pixData = sourceImg.get(x, y);
      let maskData = maskImg.get(x, y);
      let pointSize = 3;
      if(maskData[0] < 128) {
        fill(86, 113, 176);
        ellipse(x, y, pointSize, pointSize);    
      }
      fill(184, 197, 230);
      ellipse(x, y, pointSize, pointSize);    
    }  
    for(let i=0;i<4000;i++) {
        colorMode(RGB);
        let x = floor(random(sourceImg.width));
        let y = floor(random(sourceImg.height));
        let pixData = sourceImg.get(x, y);
        let maskData = maskImg.get(x, y);
        let pointSize = 3;
        fill(pixData);
        ellipse(x, y, pointSize, pointSize);
      }
      renderCounter = renderCounter + 1;
    //---------------------------------------------------------------------------------
  }
  else if (curLayer == 2){
    //--------------------------------- Medium Stars ----------------------------------
    for(let i=0;i<800;i++) {
        colorMode(HSB);
        let x = floor(random(sourceImg.width));
        let y = floor(random(sourceImg.height));
        let maskData = maskImg.get(x, y);
        let pointSize = random(10, 60)
        let shapeHue = random(210, 320);
        let maskHue = random(210, 240);
        let saturation = 60
        let brightness = random(30, 90)
        let light = 95;
        let white = 0;
        
        if(maskData[0] > 128) {
          starShape (x, y, pointSize, shapeHue, saturation, brightness)
          starShapeTop (x, y, pointSize, shapeHue, white, light)
        }
        else {
          starShape (x, y, pointSize, maskHue, saturation, brightness)
          starShapeTop (x, y, pointSize, maskHue, white, light)
        }
      }
      renderCounter = renderCounter + 1;
    //---------------------------------------------------------------------------------
    }
  else if (curLayer == 3){
    //--------------------------------- Large Stars -----------------------------------
    for(let i=0;i<5;i++) {
        colorMode(HSB);
        let x = floor(random(sourceImg.width));
        let y = floor(random(sourceImg.height));
        let maskData = maskImg.get(x, y);
        let pointSize = random(100, 500)
        let shapeHue = random(210, 320);
        let maskHue = random(210, 240);
        let saturation = 60
        let brightness = random(70, 90)
        let light = 100;
        let white = 0;
        
        if(maskData[0] > 128) {
          starShape (x, y, pointSize, shapeHue, saturation, brightness)
          starShapeTop (x, y, pointSize, shapeHue, white, light)
        }
        else {
          starShape (x, y, pointSize, maskHue, saturation, brightness)
          starShapeTop (x, y, pointSize, maskHue, white, light)
        }
      }
      renderCounter = renderCounter + 1;
    //---------------------------------------------------------------------------------
    }
  else {
    //------------------------------- Blob Tracking ----------------------------------
      colorMode(HSB);
      if (maskCenter !== null) {
        noStroke();
        starShape (maskCenter[0], maskCenter[1], 50, 340, 100, 90)
        starShapeTop (maskCenter[0], maskCenter[1], 50, 340, 0, 95)
        fill(100, 0, 100, 0);
        stroke(100, 0, 100);
        strokeWeight(3);
        rect(maskCenter[0]-40, maskCenter[1]-40, 80);
        line(maskCenter[0]-40, maskCenter[1], maskCenter[0]-20, maskCenter[1]);
        line(maskCenter[0]+40, maskCenter[1], maskCenter[0]+20, maskCenter[1]);
        line(maskCenter[0], maskCenter[1]-40, maskCenter[0], maskCenter[1]-20);
        line(maskCenter[0], maskCenter[1]+40, maskCenter[0], maskCenter[1]+20);
        textSize(20);
        strokeWeight(0);
        stroke(60, 70, 100);
        fill(60, 70, 100);
        text('unknown signal detected', maskCenter[0]-105, maskCenter[1]+70)
      }
      renderCounter = renderCounter + 1;
    //---------------------------------------------------------------------------------
  }

  //-------------------------------- Render Counter ---------------------------------
  // print(renderCounter);
  if(curLayer == 0 && renderCounter > Y_STOP) {
    curLayer = 1;
    renderCounter = 0;
    console.log("Layer 1 done!")
  }
  else if(curLayer == 1 && renderCounter > 1) {
    curLayer = 2;
    renderCounter = 0;
    console.log("Layer 2 done!")
  }
  else if(curLayer == 2 && renderCounter > 1) {
    curLayer = 3;
    renderCounter = 0;
    console.log("Layer 3 done!")
  }
  else if(curLayer == 3 && renderCounter > 1) {
    curLayer = 4;
    renderCounter = 0;
    console.log("Layer 4 done!")
  }
  else if(curLayer == 4 && renderCounter > 1) {
    console.log("Done!")
    noLoop();
  //------------------------------ Save Artwork Toggle ------------------------------
    // uncomment this to save the result
    saveArtworkImage(outputFile);
  }

} //======================================= FUNCTION DRAW END ============================================

function keyTyped() {
  if (key == '!') {
    saveBlocksImages();
  }
}

//=============================================== EXAMPLES ===============================================

  //------------------------ Colour/Saturation Change EXAMPLE -----------------------
    // let num_lines_to_draw = 40;
    // // get one scanline
    // for(let j=renderCounter; j<renderCounter+num_lines_to_draw && j<1080; j++) {
    //   for(let i=0; i<1920; i++) {
    //     colorMode(RGB);
    //     let pix = sourceImg.get(i, j);
    //     // create a color from the values (always RGB)
    //     let col = color(pix);
    //     let mask = maskImg.get(i, j);

    //     colorMode(HSB, 360, 100, 100);
    //     // draw a "dimmed" version in gray
    //     let h = hue(col);
    //     let s = saturation(col);
    //     let b = brightness(col);

    //     if(mask[0] > 128) {
    //       // draw the full pixels
    //       // let new_sat = map(s, 0, 100, 50, 100);
    //       let new_brt = map(b, 0, 100, 50, 100);
    //       // let new_hue = map(h, 0, 360, 180, 540);
    //       let new_col = color(0, s, new_brt);
    //       set(i, j, new_col);
    //     }
    //     else {
    //       // let new_brt = map(b, 0, 100, 20, 40);
    //       let new_brt = map(b, 0, 100, 100, 0);
    //       let new_col = color(h, 0, new_brt);
    //       // let new_col = color(h, s, b);
    //       set(i, j, new_col);
    //     }
    //   }
    // }
  //---------------------------------------------------------------------------------

  //------------------------------ Dot and Line Example ------------------------------
    // rectMode(CORNERS);
    // for(let i=0; i<100; i++) {
    //   let x1 = random(0, width);
    //   let y1 = random(0, height);
    //   let x2 = x1 + random(-10, 10);
    //   let y2 = y1 + random(-10, 10);
    //   colorMode(RGB);
    //   let pix = sourceImg.get(x1, y1);
    //   let mask = maskImg.get(x1, y1);
    //   let col = color(pix);
    //   stroke(col);
    //   fill(col);
    //   if(mask[1] < 128) {
    //     line(x1, y1, x2, y2);
    //   }
    //   else {
    //     rect(x1, y1, x2, y2);
    //   }
    // }
    // renderCounter = renderCounter + 1;
    // // set(i, j, new_col);
  //---------------------------------------------------------------------------------

  //---------------------------- Original Render Counter ----------------------------
    // renderCounter = renderCounter + 1;
    // if(renderCounter > 10) {
    //   console.log("Done!")
    //   noLoop();
  //---------------------------------------------------------------------------------

