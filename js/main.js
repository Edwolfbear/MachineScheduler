class Scheduler {
  #rawtext

  constructor(rawtext) {
    this.#rawtext = rawtext.split(new RegExp(
      /(Producto\tTiempo de procesamiento \(p\)|Tiempos de preparación \(s\))/
    ));

    this.productsLength;

    this.maintenanceTime;
    this.timeForMaintenance;
    this.processingTimes;
    this.preparationTimes;

    this.productsProcessed = [0];

    this.getNMT();
    this.getP();
    this.getS();
    this.solve();
  }

  /** parse n, M and T from instance file */
  getNMT() {
    let unparseNMT = this.#rawtext[0].split("\n");
    this.productsLength = parseFloat(unparseNMT[0].split('\t')[1]);
    this.maintenanceTime = parseFloat(unparseNMT[1].split('\t')[1]);
    this.timeForMaintenance = parseFloat(unparseNMT[2].split('\t')[1]);
  }

  /** parse p from instance file */
  getP() {
    let p = [];
    let unparseP = this.#rawtext[2];
    for(let line of unparseP.split('\n')) {
      if(line.split('\t').length == 2) { p.push(parseFloat(line.split('\t')[1])); }
    }

    this.processingTimes = p;
  }

  /** parse s from instance file */
  getS() {
    let unparseS = this.#rawtext[4];
    let unparseMatrix = [];
    let s = [];

    for(let line of unparseS.split('\n')) {
      unparseMatrix.push(line.split('\t'));
    }

    for(let i in unparseMatrix) {
      if(i > 2) {
        s.push(unparseMatrix[i].slice(1).map(value => parseFloat(value)));
      }
    }

    this.preparationTimes = s.slice(0, s.length-1)
  }

  /**
   * generate a element for each task
   * @param {String} taskname - Processing | Preparing | Maintenance
   * @param {int, int[]} product - index or product(s)
   */
  addTask(taskname, product) {
    let task = document.createElement("div");
    if(taskname == "Maintenance") {
      task.appendChild(document.createTextNode(taskname));
      task.style = `
        float: left;
        text-align: center;
        background-color: GRAY;
        width: ${this.maintenanceTime*2.5}px
      `;
    } else if(taskname == "Preparing") {
      task.appendChild(document.createTextNode("Preparing"));
      task.style = `
        float: left;
        text-align: center;
        background-color: BLUE;
        width: ${this.preparationTimes[product[0]][product[1]]*2.5}px;
      `;
    } else if(taskname == "Processing") {
      task.appendChild(document.createTextNode(taskname+" P"+product));
      task.style = `
        float: left;
        text-align: center;
        background-color: RED;
        width: ${this.processingTimes[product]*2.5}px
      `;
    }

    document.getElementById("schedule").appendChild(task);
  }

  /** scheduler heuristic algorithm */
  solve() {
    // variable to measure time
    let time = 0;
    // variable to know if all process doesn't fit in remaining time
    let biggers = 0;

    while(this.productsProcessed.length-1 != this.productsLength) {
      // save all index and times for each iteration and preparation time
      let indexTimes = [];
      for(let i in this.preparationTimes[0]) {
        indexTimes.push([parseInt(i), this.preparationTimes[0][i]]);
      }

      // remove products processed from indexTimes
      for(let i of this.productsProcessed) {
        indexTimes = indexTimes.filter((value) => {
          return value[0] != i;
        });
      }

      // add the process time plus the preparation time
      for(let i in indexTimes) {
        indexTimes[i][1] += this.processingTimes[indexTimes[i][0]-1];
      }

      // order from smalles to largest
      indexTimes.sort((a, b) => { return a[1] - b[1]; });

      // check if the first datum of indexTimes fits in remaining time else check the next datum
      for(let t of indexTimes) {
        if(time+t[1] < this.timeForMaintenance) {
          this.addTask("Preparing", [
            this.productsProcessed[this.productsProcessed.length-1], t[0]
          ]);

          this.productsProcessed.push(t[0]);

          this.addTask("Processing", t[0]);

          time += t[1];
          biggers = 0;

          break;
        } else { biggers += 1; }

        // if there isn't a procees that fit on remaining time starts de maintenance
        if(biggers == indexTimes.length) { console.log(time);
          time = 0; biggers = 0; this.addTask("Maintenance");
        }
      }
    }
  }
}

// DROP FILE AND START ALGORITHM
var dropZone = document.getElementById('drop_zone');

dropZone.addEventListener('drop', (event) => {
  event.stopPropagation();
  event.preventDefault();

  try {
    let files = event.dataTransfer.files;
    if(files.length == 1) {
      let reader = new FileReader();
      reader.readAsText(files[0]);
      reader.onload = (event) => {
        let result = new Scheduler(reader.result);
      };
    } else { throw "Solo puedes subir un archivo."; }
  } catch(err) {
    // TODO: edit here for usability
    console.log(err);
  }
}, false);

dropZone.addEventListener('dragover', (event) => {
  event.stopPropagation();
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
}, false);
