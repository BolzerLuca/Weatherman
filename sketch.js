let api_url, lat, lon, søgLat, søgLon, by, land, inpBy, inpLand = "";
let søgKnap, tempNu, følesNu,logo,termoIkon,dråbeIkon,solrig,sky,skySol,skySolRegn,skyRegn,solIkon;
let tempMax,vejrKode,vejrKodeTime,timeTemp, timeRegn, regnSum, byger, tryk, skydække, sigtbarhed, vind, vindRetning, vindStød, solop, solned, uvDag, uvTime = [];
let timer = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
function preload() {
  logo = loadImage('Skoldede skaller.png');
  termoIkon = loadImage('termometer ikon.png');
  dråbeIkon = loadImage('DråbeIkon.png');
  solrig = loadImage('Solrig.png');
  sky = loadImage('Sky.png');
  skySol = loadImage('SkyetSol.png');
  skySolRegn = loadImage('SkyetSolRegn.png');
  skyRegn = loadImage('Skyregn.png');
  varmepile = loadImage('varmepile.png');
  windsock = loadImage('windsock.png');
  sortPil = loadImage('pilOp.png');
  solIkon = loadImage('SOL.png');
}
function setup() {
  //laver canvas og top bar
  createCanvas(windowWidth,1500);
  background(105, 179, 211);
  fill(59, 109, 167);
  rect(0,0,width,50);
  //sætter logo ind
  image(logo,0,0,200,50);
  //søge tekst input for byen
  inpBy = createInput("City");
  inpBy.position(width-200, 0);
  inpBy.size(100);
  inpBy.input(updateBy);
  // søge tekst input for landet
  inpLand = createInput("Country");
  inpLand.position(width-100,0);
  inpLand.size(100);
  inpLand.input(updateLand);
  //Knap til at søge
  søgKnap = createButton("søg");
  søgKnap.size(50)
  søgKnap.position(width-255, 0);
  søgKnap.mousePressed(søg);

  getlocation();
}

function updateBy() {
  by = inpBy.value();
}

function updateLand() {
  land = inpLand.value();
}

function getlocation() {
  //finde position af enhed
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((position) => {
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      // søge vejr data
      api_url =
      "https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+lon+"&hourly=temperature_2m,relativehumidity_2m,weathercode,apparent_temperature,rain,showers,pressure_msl,cloudcover,visibility,windspeed_10m,winddirection_10m,windgusts_10m,uv_index&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,uv_index_clear_sky_max,rain_sum,windspeed_10m_max,weathercode,windgusts_10m_max&windspeed_unit=ms&timezone=auto";
      fetch(api_url)
        .then((response) => response.json())
        //opdatere data
        .then((data) => {
          tempNu = data.hourly.temperature_2m[hour()];
          følesNu = data.hourly.apparent_temperature[hour()];
          tempMax = data.daily.temperature_2m_max;
          timeRegn = data.hourly.rain;
          timeTemp = data.hourly.temperature_2m;
          regnSum = data.daily.rain_sum;
          byger = data.hourly.showers;
          tryk = data.hourly.pressure_msl;
          skydække = data.hourly.cloudcover;
          sigtbarhed = data.hourly.visibility;
          vind = data.hourly.windspeed_10m;
          vindRetning = data.hourly.winddirection_10m;
          vindStød = data.hourly.windgusts_10m;
          solop = data.daily.sunrise;
          solned = data.daily.sunset;
          uvDag = data.daily.uv_index_max;
          uvTime = data.hourly.uv_index;;
          vejrKode = data.daily.weathercode;
          vejrKodeTime = data.hourly.weathercode;
          tegn();
          resolve(data);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  });
  
}


function søg() {
  //tage søg input og find lat og lon
  return new Promise((resolve, reject) => {
      let lokationApi =
      "https://api.geoapify.com/v1/geocode/search?city="+by+"&country="+land+"&format=json&apiKey=f9fe0bda61e74dba829afb382d22d33a";
      fetch(lokationApi)
        .then((response) => response.json())
        .then((geocodeResponse) => {
          //console.log(geocodeResponse);
          søgLat = geocodeResponse.results[0].lat;
          søgLon = geocodeResponse.results[0].lon;
          søgVejr();
          resolve(geocodeResponse);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
  
  });
}

function søgVejr() {
  //finder ny data med opgivne by
  api_url =
  "https://api.open-meteo.com/v1/forecast?latitude="+søgLat+"&longitude="+søgLon+"&hourly=temperature_2m,weathercode,relativehumidity_2m,apparent_temperature,rain,showers,pressure_msl,cloudcover,visibility,windspeed_10m,winddirection_10m,windgusts_10m,uv_index&daily=temperature_2m_max,weathercode,temperature_2m_min,sunrise,sunset,uv_index_max,uv_index_clear_sky_max,rain_sum,windspeed_10m_max,windgusts_10m_max&windspeed_unit=ms&timezone=auto";
  fetch(api_url)
    .then((response) => response.json())
    //Opdatere data
    .then((data) => {
      tempNu = data.hourly.temperature_2m[hour()];
      følesNu = data.hourly.apparent_temperature[hour()];
      tempMax = data.daily.temperature_2m_max;
      timeRegn = data.hourly.rain;
      regnSum = data.daily.rain_sum;
      byger = data.hourly.showers;
      tryk = data.hourly.pressure_msl;
      skydække = data.hourly.cloudcover;
      sigtbarhed = data.hourly.visibility;
      vind = data.hourly.windspeed_10m;
      vindRetning = data.hourly.winddirection_10m;
      vindStød = data.hourly.windgusts_10m;
      solop = data.daily.sunrise;
      solned = data.daily.sunset;
      uvDag = data.daily.uv_index_max;
      uvTime = data.hourly.uv_index;
      vejrKode = data.daily.weathercode;
      vejrKodeTime = data.hourly.weathercode;
      tegn();
    });
}

function tegn() {
  let boksTyk = width/4;
  let boksMellemrumHor = width/16;
  let boksMellemrumVer = 50;
  let boksLang = 417;
  let boksKort = 313;
  let idagBoksHøj = 500;
  let idagBoksMel = width/30;
  let idagBoksOpdel = (width-2*width/30)/3;
  strokeWeight(2);
  
  //tegner baggrunds kasse for frem ad
  fill(209, 234, 245);
  rect(0,idagBoksHøj,width,1000);
  
  //tegner kassen til idag
  fill(255);
  rect(width/30,90,width-2*width/30,357,10);
  
  //tegner navneboksen på idag
  fill(79, 147, 226);
  rect(width/30,90,width-2*width/30,40,10,10,0,0);
  //baggrunde til bokse
  fill(255);
  //temperatur
  rect(boksMellemrumHor,idagBoksHøj+boksMellemrumVer,boksTyk,boksLang,10);
  //UV
  rect(boksMellemrumHor*2+boksTyk,idagBoksHøj+boksMellemrumVer,boksTyk,boksLang,10);
  //nedbør
  rect(boksMellemrumHor*3+boksTyk*2,idagBoksHøj+boksMellemrumVer,boksTyk,boksKort,10);
  //vind
  rect(boksMellemrumHor*3+boksTyk*2,idagBoksHøj+boksMellemrumVer*2+boksKort,boksTyk,boksKort,10);
  //tryk
  rect(boksMellemrumHor*2+boksTyk,idagBoksHøj+boksMellemrumVer*2+boksLang,boksTyk,boksKort,10);
  
  //blå navneboks til kasserne
  fill(79, 147, 226);
  //temperatur
  rect(boksMellemrumHor,idagBoksHøj+boksMellemrumVer,boksTyk,40,10,10,0,0);
  //Uv
  rect(boksMellemrumHor*2+boksTyk,idagBoksHøj+boksMellemrumVer,boksTyk,40,10,10,0,0);
  //Nedbør
  rect(boksMellemrumHor*3+boksTyk*2,idagBoksHøj+boksMellemrumVer,boksTyk,40,10,10,0,0);
  //vind
  rect(boksMellemrumHor*3+boksTyk*2,idagBoksHøj+boksMellemrumVer*2+boksKort,boksTyk,40,10,10,0,0);
  //tryk
  rect(boksMellemrumHor*2+boksTyk,idagBoksHøj+boksMellemrumVer*2+boksLang,boksTyk,40,10,10,0,0);
  
  //tekst i de blå kasser
  textSize(20);
  fill(0);
  textAlign(CENTER);
  text('Nu',width/2,120);
  text('Temperatur',boksMellemrumHor+boksTyk/2,idagBoksHøj+boksMellemrumVer+30);
  text('UV-Index',boksMellemrumHor*2+boksTyk*1.5,idagBoksHøj+boksMellemrumVer+30);
  text('Nedbør',boksMellemrumHor*3+boksTyk*2.5,idagBoksHøj+boksMellemrumVer+30);
  text('Vind',boksMellemrumHor*3+boksTyk*2.5,idagBoksHøj+boksMellemrumVer*2+boksKort+30);
  text('Tryk',boksMellemrumHor*2+boksTyk*1.5,idagBoksHøj+boksMellemrumVer*2+boksLang+30);
  
  // tegne uv graf
  fill(255);
  rect(boksMellemrumHor*2+boksTyk+10,idagBoksHøj+boksMellemrumVer+(boksLang-10)/2,boksTyk-20,(boksLang-10)/2);
  fill(0);
  textSize(12);
  textAlign(CENTER);
  text('UV time for time',boksTyk*1.5+boksMellemrumHor*2,idagBoksHøj+boksMellemrumVer+(boksLang-10)/2+12 );
  let UVx = boksMellemrumHor*2+boksTyk+30+(boksTyk-50);
  let UVy = idagBoksHøj+boksMellemrumVer+(boksLang-10)-50;
  for (let i = 0; i < 24; i++) {
    strokeWeight(4);
    let UV = Number(uvTime[i]);
    if (UV > 7){
      continue;
    }
    point(boksMellemrumHor*2+boksTyk+30+(boksTyk-50)/24*i,idagBoksHøj+boksMellemrumVer+(boksLang-10)-50-UV*20);
    strokeWeight(0.5);
    line(UVx, UVy, boksMellemrumHor*2+boksTyk+30+(boksTyk-50)/24*i, idagBoksHøj+boksMellemrumVer+(boksLang-10)-50-UV*20)
    UVx = boksMellemrumHor*2+boksTyk+30+(boksTyk-50)/24*i;
    UVy = idagBoksHøj+boksMellemrumVer+(boksLang-10)-50-UV*20;
  }
  for (let i=0; i<24;i++){
    if (i%3==0) {
      textSize(10);
      text(timer[i],boksMellemrumHor*2+boksTyk+30+(boksTyk-50)/24*i,idagBoksHøj+boksMellemrumVer+(boksLang-10)-30);
    }
  }
  for (let i = 0; i<7; i++){
    strokeWeight(1);
    let linex = boksMellemrumHor*2+boksTyk+30;
    let liney = idagBoksHøj+boksMellemrumVer+(boksLang-10)-50-i*20;
    line(linex,liney,linex+boksTyk-40,idagBoksHøj+boksMellemrumVer+(boksLang-10)-50-i*20);
    textAlign(CENTER);
    text(i+'',linex-10,liney);
  }

  // Nu temperatur
  image(termoIkon,width/110,140,(width-2*width/30)/4,250);
  textSize(20);
  textAlign(LEFT);
  text(''+tempNu+'℃',width/110+(width-2*width/6)/4,240);
  textSize(12);
  text('Føles som: '+følesNu+'℃',width/110+(width-2*width/6)/4,260,(width-2*width/30)/4+width/30);
  
  for (let i = 0; i < 2; i++) {
    fill(0);
    line(idagBoksMel+(idagBoksOpdel)+i*(idagBoksOpdel),130,width/30+((width-2*width/30)/3)+i*(width-2*width/30)/3,447);
  }

  //tegne nedbør
  push();
  textAlign(CENTER);
  image(dråbeIkon,idagBoksMel+idagBoksOpdel*2.05,140,idagBoksOpdel/1.1,288);
  textSize(20);
  let regnIdag = regnSum[0];
  text(regnIdag+' mm',idagBoksMel+idagBoksOpdel*2.5,332);
  pop();

  // tegne temperatur time for time

  push();
  textSize(15);
  textAlign(CENTER,TOP);
  for (let i=0; i<5; i++) {
   let tid = hour()+i;
    let vejrIkonTime = sky;
  if (vejrKodeTime[hour()+i] == 1 || vejrKodeTime[hour()+i] == 2 || vejrKodeTime[hour()+i] == 3){
    vejrIkonTime = skySol;
  }
  if (vejrKodeTime[hour()+i] ==0){
    vejrIkonTime = solrig;
  }
  if (vejrKodeTime[hour()+i] == 51 || vejrKodeTime[hour()+i] == 53 || vejrKodeTime[hour()+i] == 55||vejrKodeTime[hour()+i] == 56||vejrKodeTime[hour()+i] == 57 ||vejrKodeTime[hour()+i] == 61 ||vejrKodeTime[hour()+i] == 63 ||vejrKodeTime[hour()+i] == 65 ||vejrKodeTime[hour()+i] == 80 ||vejrKodeTime[hour()+i] == 81 ||vejrKodeTime[hour()+i]==82){
    vejrIkonTime = skyRegn;
  }
    text(''+tid,boksMellemrumHor+(boksTyk-2*(width/70+width/100))/4*i+width/70+width/100,idagBoksHøj+boksMellemrumVer+70);
    text(timeTemp[hour()+i]+' ℃',boksMellemrumHor+(boksTyk-2*(width/70+width/100))/4*i+width/70+width/100,idagBoksHøj+boksMellemrumVer+170);
    image(vejrIkonTime,boksMellemrumHor+(boksTyk-2*(width/70+width/100))/4*i+width/70-(boksTyk-2*(width/70+width/100))/10+width/100,idagBoksHøj+boksMellemrumVer+100,(boksTyk-2*width/70)/5,50);
  }
  pop();

  // Uv mand
  push();
  strokeWeight(2);
  stroke(0);
  // Sætter (0, 0) i midten af "i dag" boksen
  translate(width/2-50,idagBoksHøj/2+20);
  ellipseMode(CENTER);
  // Ændrer farven på manden afhængig af UV-indekset
  let a = map(uvTime[hour()], 0, 10, 0, 255);
  fill(255, 0, 0, a);
  ellipse(0, 50, 100);
  fill(255);
  beginShape();
  vertex(-75, 40);
  vertex(75, 40);
  vertex(50, 0);
  vertex(-50, 0);
  vertex(-75, 40);
  endShape();
  rectMode(CENTER);
  rect(0, -15, 100, 30);
  // sveddråbe
  push();
  translate(-50, -25);
  noStroke();
  let r = map(tempNu, 5, 30, 0, 255);
  fill(r, 100-r, 255-r);
  ellipse(0, 0, 14);
  beginShape();
  vertex(7.5, 0);
  vertex(-7.5, 0);
  vertex(0, -25);
  vertex(7.5, 0);
  endShape();
  pop();
  // sol
  push();
  translate(175, -75);
  noStroke();
  fill(255, 255, 0);
  ellipse(0, 0, 100);
  textAlign(CENTER);
  strokeWeight(1);
  stroke(0);
  fill(0);
  text('UV', 0, 0);
  text(uvTime[hour()], 0, 10);
  // varmepile
  rotate(PI*0.82);
  image(varmepile, 60, -40, 75, 75);
  pop();
  pop();

  // nedbør over dage
  push();
  translate(boksTyk*2 + boksMellemrumHor*3, idagBoksHøj + boksMellemrumVer + 40);
  let day = new Date().getDay();
  textSize(25);
  for (let i = 0; i < 7; i++){
    // skriver "i dag" og "i morgen"
    switch(i) {
      case 0:
        text("I dag", 5, 25);
        break;
      case 1:
        text("I morgen", 5, 20 + (boksKort-40)/7);
        break; 
    }
    // skrive de resterende 5 ugedage
    if (i > 1) {
      switch(day) {
        case 1:
          text("Mandag", 5, 20 + i*(boksKort-40)/7);
          break;
        case 2:
          text("Tirsdag", 5, 20 + i*(boksKort-40)/7);
          break;
        case 3:
          text("Onsdag", 5, 20 + i*(boksKort-40)/7);
          break;
        case 4:
          text("Torsdag", 5, 20 + i*(boksKort-40)/7);
          break;
        case 5:
          text("Fredag", 5, 20 + i*(boksKort-40)/7);
          break;
        case 6:
          text("Lørdag", 5, 20 + i*(boksKort-40)/7);
          break;
        case 7:
          text("Søndag", 5, 20 + i*(boksKort-40)/7);
          break;
      }
    }
    if (day == 7) {
      day = 1;
    } else {
      day++;
    }
  }
  // skriver nedbør for dagene
  textAlign(RIGHT);
  for (let i = 0; i < 7; i++) {
    text(regnSum[i] + " mm", boksTyk - 40, 25 + i*(boksKort-40)/7);
    image(dråbeIkon, boksTyk - 30, 10 + i*(boksKort-40)/7, 20, 20);
  }
  pop();

  // vindretning
  push();
  translate(boksTyk*2.5 + boksMellemrumHor*3, idagBoksHøj + boksMellemrumVer*2 + boksKort*1.5 + 20);
  // kompass
  textAlign(CENTER);
  strokeWeight(3);
  textSize(20);
  text("N", 0, -110);
  text("Ø", 110, 5);
  text("S", 0, 110);
  text("V", -110, 5);
  // vindhastighed m/s
  strokeWeight(5);
  textSize(25);
  text(vind[hour()] + " m/s", -boksTyk/4, -100);
  // vindsok
  imageMode(CENTER);
  angleMode(DEGREES);
  rotate(vindRetning[hour()] + 90);
  image(windsock, 45, 0, 90, 45);
  ellipse(0, 0, 10);
  pop();
    
  //temperatur over dage'
  let ugeDag;
  let fåDag = new Date().getDay();
  for (let i = 0; i<5;i++){
  switch (fåDag) {
    case 1:
      ugeDag = "Mandag";
      break;
    case 2:
      ugeDag = "Tirsdag";
      break;
    case 3:
       ugeDag = "Onsdag";
      break;
    case 4:
      ugeDag = "Torsdag";
      break;
    case 5:
      ugeDag = "Fredag";
      break;
    case 6:
      ugeDag = "Lørdag";
      break;
    case 7:
      ugeDag = "Søndag";
  }
  if (fåDag == 7){
    fåDag = 1;
  }
  else {
    fåDag++;
  }
  let vejrIkonDag = sky;
  if (vejrKode[i] == 1 || vejrKode[i] == 2 || vejrKode[i] == 3){
    vejrIkonDag = skySol;
  }
  if (vejrKode[i] ==0){
    vejrIkonDag = solrig;
  }
  if (vejrKode[i] == 51 || vejrKode[i] == 53 || vejrKode[i] == 55||vejrKode[i] == 56||vejrKode[i] == 57 ||vejrKode[i] == 61 ||vejrKode[i] == 63 ||vejrKode[i] == 65 ||vejrKode[i] == 80 ||vejrKode[i] == 81 ||vejrKode[i]==82){
    vejrIkonDag = skyRegn;
  }
  
  push();
  translate(boksMellemrumHor,idagBoksHøj+boksMellemrumVer+40);
  textSize(15);
  textAlign(CENTER);
  text(ugeDag,width/100+(boksTyk-2*width/100)/10+(boksTyk-2*width/100)/5*i,200);
  text(tempMax[i]+'℃',width/100+(boksTyk-2*width/100)/10+(boksTyk-2*width/100)/5*i,300);
  image(vejrIkonDag,width/100+(boksTyk-2*width/100)/5*i,225,(boksTyk-2*width/100)/5,50);
  pop();
  }
  
  // tryk
  push();
  translate(boksMellemrumHor*2 + boksTyk, idagBoksHøj + boksLang + boksMellemrumVer*2 + 40);
  day = new Date().getDay();
  textSize(25);
  for (let i = 0; i < 7; i++){
    // skriver "i dag" og "i morgen"
    switch(i) {
      case 0:
        text("I dag", 5, 25);
        break;
      case 1:
        text("I morgen", 5, 20 + (boksKort-40)/7);
        break; 
    }
    // skrive de resterende 5 ugedage
    if (i > 1) {
      switch(day) {
        case 1:
          text("Mandag", 5, 20 + i*(boksKort-40)/7);
          break;
        case 2:
          text("Tirsdag", 5, 20 + i*(boksKort-40)/7);
          break;
        case 3:
          text("Onsdag", 5, 20 + i*(boksKort-40)/7);
          break;
        case 4:
          text("Torsdag", 5, 20 + i*(boksKort-40)/7);
          break;
        case 5:
          text("Fredag", 5, 20 + i*(boksKort-40)/7);
          break;
        case 6:
          text("Lørdag", 5, 20 + i*(boksKort-40)/7);
          break;
        case 7:
          text("Søndag", 5, 20 + i*(boksKort-40)/7);
          break;
      }
    }
    if (day == 7) {
      day = 1;
    } else {
      day++;
    }
  }
  // skriver trykket i højre side
  textAlign(RIGHT);
  for (let j = 0; j < 7; j++) {
    let trykSum = 0;
    for (let i = 0; i < 24; i++) {
      trykSum += tryk[j*24 + i];
    }
    text(round(trykSum/24) + " hPa", boksTyk -30, 25 + j*(boksKort-40)/7);
    image(sortPil, boksTyk - 25, 7 + j*(boksKort-40)/7, 20, 20);
  }
  pop();


  //UV over dage
   let ugeDag1;
   let fåDag1 = new Date().getDay();

   for (let i = 0; i<5;i++){
   switch (fåDag1) {
     case 1:
       ugeDag1 = "Mandag";
       break;
     case 2:
       ugeDag1 = "Tirsdag";
       break;
     case 3:
        ugeDag1 = "Onsdag";
       break;
     case 4:
       ugeDag1 = "Torsdag";
       break;
     case 5:
       ugeDag1 = "Fredag";
       break;
     case 6:
       ugeDag1 = "Lørdag";
       break;
     case 7:
       ugeDag1 = "Søndag";
   }
   if (fåDag1 == 7){
     fåDag1 = 1;
   }
   else {
     fåDag1++;
   }
   push();
   textSize(15);
   textAlign(CENTER);
   translate(boksMellemrumHor*2+boksTyk,idagBoksHøj+boksMellemrumVer+40);
   text(ugeDag1,width/300+(boksTyk-2*(width/100))/10+((boksTyk-2*(width/100))/5+width/300)*i,30);
   image(solIkon,width/300+((boksTyk-2*(width/100))/5+width/300)*i,50,(boksTyk-2*(width/100))/5,70);
   text(uvDag[i],width/300+(boksTyk-2*(width/100))/10+((boksTyk-2*(width/100))/5+width/300)*i,90);
   pop();
  }
}
