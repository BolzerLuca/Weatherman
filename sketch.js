let api_url, lat, lon, søgLat, søgLon, by, land, inpBy, inpLand = "";
let søgKnap, tempNu, følesNu,logo,termoIkon;
let tempMax, timeRegn, regnSum, byger, tryk, skydække, sigtbarhed, vind, vindRetning, vindStød, solop, solned, uvDag, uvTime = [];
let timer = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
function preload() {
  logo = loadImage('Skoldede skaller.png');
  termoIkon = loadImage('termometer ikon.png');
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
  tegn();
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
"https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+lon+"&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,rain,showers,pressure_msl,cloudcover,visibility,windspeed_10m,winddirection_10m,windgusts_10m,uv_index&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,uv_index_clear_sky_max,rain_sum,windspeed_10m_max,windgusts_10m_max&windspeed_unit=ms&timezone=auto";
      fetch(api_url)
        .then((response) => response.json())
      //opdatere data
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
"https://api.open-meteo.com/v1/forecast?latitude="+søgLat+"&longitude="+søgLon+"&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,rain,showers,pressure_msl,cloudcover,visibility,windspeed_10m,winddirection_10m,windgusts_10m,uv_index&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,uv_index_clear_sky_max,rain_sum,windspeed_10m_max,windgusts_10m_max&windspeed_unit=ms&timezone=auto";
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
  for (let i = 0; i < 24; i++) {
    strokeWeight(4);
    let UV = Number(uvTime[i]);
    if (UV > 7){
      continue;
    }
  point(boksMellemrumHor*2+boksTyk+30+(boksTyk-50)/24*i,idagBoksHøj+boksMellemrumVer+(boksLang-10)-50-UV*20);
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
    line(width/30+((width-2*width/30)/3)+i*((width-2*width/30)/3),130,width/30+((width-2*width/30)/3)+i*(width-2*width/30)/3,447);
  }
}