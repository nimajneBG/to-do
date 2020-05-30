//Popups
class PopUp {

  constructor(x) {
    this.input = x;
    this.popUpBg;
    this.popUp;
    this.btnOk;
    this.btnCancel;
    this.btnCustom;
    this.closeX;
  }

  create() {

    //Error detection
    if (this.input.ok != true && this.input.cancel != true && this.input.custom != true) {
      console.error("At least one sort of button have to be selected.");
      return 1;
    }


    //Create background
    this.popUpBg = document.createElement("DIV");
    this.popUpBg.classList.add("pop-up-bg");
    document.body.appendChild(this.popUpBg);


    //Create pop-up
    this.popUp = document.createElement("DIV");
    this.popUp.classList.add("pop-up");
    this.popUpBg.appendChild(this.popUp);

    //Close x
    if (this.input.close == true) {
      this.closeX = document.createElement("DIV");
      this.closeX.classList.add("popup-close");
      this.closeX.innerHTML = '<i class="cross"></i>';
      this.popUp.appendChild(this.closeX);
    }

    //Icon
    if (this.input.icon != false) {
      var icon = document.createElement("P");
      icon.classList.add("pop-up-icon");
      icon.innerHTML = this.input.icon;
      this.popUp.appendChild(icon);
    }

    //Text
    var popUpText = document.createElement("P");
    popUpText.innerHTML = this.input.message;
    this.popUp.appendChild(popUpText);

    //Buttons
    this.createButtons();

    return this.events();

  }


  createButtons() {
    //Create buttons
    var buttonLine = document.createElement("DIV");
    buttonLine.classList.add("button-line");
    this.popUp.appendChild(buttonLine);

    if (this.input.ok == true) {
      this.btnOk = document.createElement("BUTTON");
      this.btnOk.innerHTML = "OK";
      this.btnOk.classList.add("standard-button");
      buttonLine.appendChild(this.btnOk);
    }
    if (this.input.cancel == true) {
      this.btnCancel = document.createElement("BUTTON");
      this.btnCancel.innerHTML = "Cancel";
      this.btnCancel.classList.add("standard-button");
      buttonLine.appendChild(this.btnCancel);
    }
    if (this.input.custom == true) {
      this.btnCustom = document.createElement("BUTTON");
      this.btnCustom.innerHTML = this.input.text;
      this.btnCustom.classList.add("standard-button");
      buttonLine.appendChild(this.btnCustom);
    }

  }

  close() {
    this.popUpBg.remove();
  }



  events() {
    const bg = this.popUpBg;
    const btnOk = this.btnOk;
    const inBtnOk = this.input.ok;
    const btnCancel = this.btnCancel;
    const inBtnCancel = this.input.cancel;
    const btnCustom = this.btnCustom;
    const inBtnCustom = this.input.custom;
    const closeX = this.closeX;
    const inCloseX = this.input.close;

    var promise = new Promise(function (resolve, reject) {
      if (inCloseX == true) {
        closeX.onclick = () => {
          bg.remove();
        }
      }

      if (inBtnOk == true) {
        btnOk.onclick = () => {
          bg.remove();
          resolve("ok");
        }
      }

      if (inBtnCancel == true) {
        btnCancel.onclick = () => {
          bg.remove();
          resolve("cancel");
        }
      }

      if (inBtnCustom == true) {
        btnCustom.onclick = () => {
          bg.remove();
          resolve("custom");
        }
      }
      if (inBtnCustom != true && inBtnOk != true && inBtnCancel != true) {
        reject(Error("It broke"));
      }

    });

    return promise;

  }

}

function popUpError(message) {
  var p = new PopUp({
    "message": message,
    "ok": true,
    "cancel": false,
    "custom": false,
    "close": true,
    "icon": "🛑"
  });
  p.create().then(function (result) { }, function (err) { console.log(err); });
}