let sourceImg=null;
let maskImg=null;
let renderCounter=0;
let curLayer = 0;

// change these three lines as appropiate
let sourceFile = "input_3.jpg";
let maskFile   = "mask_3.png";
let outputFile = "output_3.png";

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

//------------------------------ Blob Tracking Setup ------------------------------
let X_STOP = 1920;
let Y_STOP = 1080;
let OFFSET = 20;

function maskCenterSearch(min_width) {
  let max_up_down = 0;
  let max_left_right = 0;
  let max_x_index = 0;
  let max_y_index = 0;

  // first scan all rows top to bottom
  print("Scanning mask top to bottom...")
  for(let j=0; j<Y_STOP; j++) {
    // look across this row left to right and count
    let mask_count = 0;
    for(let i=0; i<X_STOP; i++) {
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
  for(let i=0; i<X_STOP; i++) {
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

function draw () {
  angleMode(DEGREES);
  if (curLayer == 0) {
    //---------------------------- Colour/Saturation Change ---------------------------
      let num_lines_to_draw = 40;
      // get one scanline
      for(let j=renderCounter; j<renderCounter+num_lines_to_draw && j<1080; j++) {
          for(let i=0; i<1920; i++) {
            colorMode(RGB);
            let pix = sourceImg.get(i, j);
            // create a color from the values (always RGB)
            let col = color(pix);
            let mask = maskImg.get(i, j);

            // warp effect
            let warpOffset = 5;
            let wave = sin(j*20);
            let slip = map(wave, -1, 1, -warpOffset, warpOffset);

            colorMode(HSB, 360, 100, 100);
            // draw a "dimmed" version in gray
            let h = hue(col);
            let s = saturation(col);
            let b = brightness(col);

            if(mask[0] > 128) {
              // draw the full pixels
              //let new_sat = map(s, 0, 100, 50, 100);
              let new_brt = map(b, 0, 70, 50, 70);
              let new_hue = map(h, 0, 238, 300, 264);
              let new_col = color(new_hue, s, new_brt);
              set(i+slip, j, new_col); 
            }
            else {
              let new_brt = map(b, 0, 18, 18, 18);
              let new_hue = map(h, 0, 200, 225, 250);
              let new_col = color(new_hue, 90, new_brt);
              // let new_col = color(h, s, b);
              set(i+slip, j, new_col);
            }
          }
        }
        renderCounter = renderCounter + num_lines_to_draw;
        updatePixels();
    //---------------------------------------------------------------------------------
  }
  else if (curLayer == 1){
    //--------------------------------- Pointillism -----------------------------------
      for(let i=0;i<4000;i++) {
        colorMode(RGB);
        let x = floor(random(sourceImg.width));
        let y = floor(random(sourceImg.height));
        let pixData = sourceImg.get(x, y);
        let maskData = maskImg.get(x, y);
        fill(pixData);
        if(maskData[0] > 128) {
          let pointSize = 10;
          ellipse(x, y, pointSize, pointSize);
        }
        else {
          let pointSize = 20;
          rect(x, y, pointSize, pointSize);    
        }
      }
      renderCounter = renderCounter + 1;
    //---------------------------------------------------------------------------------
  }
  else {
    //------------------------------- Blob Tracking ----------------------------------
      colorMode(HSB);
      if (maskCenter !== null) {
        strokeWeight(5);
        fill(100, 0, 100);
        stroke(100, 0, 100);
        ellipse(maskCenter[0], maskCenter[1], 100);
        line(maskCenter[0]-200, maskCenter[1], maskCenter[0]+200, maskCenter[1]);
        line(maskCenter[0], maskCenter[1]-200, maskCenter[0], maskCenter[1]+200);
        noFill();
        let mcw = maskCenterSize[0];
        let mch = maskCenterSize[1];
        rect(maskCenter[0]-mcw/2, maskCenter[1]-mch/2, mcw, mch);
      }
    //---------------------------------------------------------------------------------
  }

  //-------------------------------- Render Counter ---------------------------------
  // print(renderCounter);
  if(curLayer == 0 && renderCounter > 1080) {
    curLayer = 1;
    renderCounter = 0;
  }
  else if(curLayer == 1 && renderCounter > 200) {
    curLayer = 2;
    renderCounter = 0;
  }
  else if(curLayer == 2 && renderCounter > 1) {
    console.log("Done!")
    noLoop();
  }

  //------------------------------ Save Artwork Toggle ------------------------------
  // uncomment this to save the result
  // saveArtworkImage(outputFile);

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

