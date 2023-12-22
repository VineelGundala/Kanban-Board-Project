let addbtn = document.querySelector(".addicn");
let popup = document.querySelector(".popupbox");
let showpopup = false;
let tickets = document.querySelector(".tickets");
popup.style.display = "none";

let allprior = document.querySelectorAll(".prior");
let colorselected = "pink";

let xbtn = document.querySelector(".deleteicon");

let ticketarr = [];

if (localStorage.getItem("tickets_store")) {
  ticketarr = JSON.parse(localStorage.getItem("tickets_store"));

  ticketarr.forEach(function (tkt) {
    createticket(tkt.inputtext, tkt.colorselected, tkt.id);
  });
}

allprior.forEach(function (eachelement) {
  eachelement.addEventListener("click", function () {
    allprior.forEach(function (allele) {
      allele.classList.remove("active");
    });
    eachelement.classList.add("active");
    colorselected = eachelement.classList[0];
    console.log(colorselected);
  });
});

addbtn.addEventListener("click", function () {
  showpopup = !showpopup;
  if (showpopup == true) {
    popup.style.display = "flex";
  } else if (showpopup == false) {
    popup.style.display = "none";
  }
});

popup.addEventListener("keydown", function (e) {
  let key = e.key;
  if (key == "Shift") {
    let typedarea = document.querySelector(".textareacont");
    let inputtext = typedarea.value;

    createticket(inputtext, colorselected);
  }
});

// creating new ticket on clicking shift

function createticket(inputtext, colorselected, ticketid) {
  let id = ticketid || shortid();

  let newele = document.createElement("div");
  newele.setAttribute("class", "ticket");
  newele.innerHTML = `<div class="priorityclr ${colorselected}"   > </div>
  <div class="idbox">${id}</div>
  <div class="ticket-task"> ${inputtext}</div>
  <div class="lockicon"><i class="fa-solid fa-lock" ></i></div>`;
  tickets.appendChild(newele);
  popup.style.display = "none";
  handlelock(newele, id);
  handleremoval(newele, id);
  changecolor(newele, id);

  if (!ticketid) {
    //this property to make sure that tickedid duplicates are not added
    ticketarr.push({ inputtext, colorselected, id });
    localStorage.setItem("tickets_store", JSON.stringify(ticketarr)); // pusing the data into local storage
  }
}
//handle lock function

function handlelock(newele, idtext) {
  let lockopen = false;
  let lockicons = newele.querySelectorAll(".lockicon"); // Select only lock icons inside the newele

  lockicons.forEach(function (lockclick) {
    let lockiconele = lockclick.children[0];
    let parent = lockclick.parentElement;
    let editarea = parent.querySelector(".ticket-task");

    lockiconele.addEventListener("click", function () {
      let indxoftkt = getidx(idtext);

      lockopen = !lockopen;

      if (lockopen) {
        lockiconele.classList.remove("fa-lock");
        lockiconele.classList.add("fa-lock-open");
        editarea.setAttribute("contenteditable", "true");
      } else {
        lockiconele.classList.remove("fa-lock-open");
        lockiconele.classList.add("fa-lock");
        editarea.setAttribute("contenteditable", "false");
      }

      ticketarr[indxoftkt].inputtext = editarea.innerText;
      console.log(ticketarr);
      localStorage.setItem("tickets_store", JSON.stringify(ticketarr));
    });
  });
}

// delete button working feature
let xbtnflag = false;
xbtn.addEventListener("click", function () {
  xbtnflag = !xbtnflag;
  if (xbtnflag == true) {
    xbtn.classList.add("dltactive");
  } else {
    xbtn.classList.remove("dltactive");
  }
});

function handleremoval(ticket, id) {
  ticket.addEventListener("click", function () {
    if (!xbtnflag) {
      return;
    }

    let idxdlt = getidx(id); // deleting the ticket in local storage and array
    ticketarr.splice(idxdlt, 1);
    localStorage.setItem("tickets_store", JSON.stringify(ticketarr));
    ticket.remove();
  });
}

// change color feature on click

function changecolor(ticket, id) {
  let colorarr = ["red", "orange", "yellow", "white"];
  let clrstrip = ticket.querySelector(".priorityclr");
  clrstrip.addEventListener("click", function () {
    let idxclr = getidx(id); // getting the index of array
    console.log(idxclr);
    let currentclr = clrstrip.classList[1];

    for (let i = 0; i < colorarr.length; i++) {
      if (currentclr == colorarr[i]) {
        clrstrip.classList.remove(currentclr);
        if (i == colorarr.length - 1) {
          clrstrip.classList.add(colorarr[0]);
          ticketarr[idxclr].colorselected = colorarr[0];
          console.log(ticketarr);
          localStorage.setItem("tickets_store", JSON.stringify(ticketarr));
        } else {
          clrstrip.classList.add(colorarr[i + 1]);
          ticketarr[idxclr].colorselected = colorarr[i + 1];
          console.log(ticketarr);
          localStorage.setItem("tickets_store", JSON.stringify(ticketarr));
        }
      }
    }
  });
}

// On clicking nav colors, tickets with same color apperas

let allclrs = document.querySelectorAll(".colorbox");

for (let i = 0; i < allclrs.length; i++) {
  allclrs[i].addEventListener("click", function () {
    let clrclickd = allclrs[i].classList[0];

    let filterdtickets = ticketarr.filter(function (fltrtickets) {
      return clrclickd == fltrtickets.colorselected;
    });

    let alltickets = document.querySelectorAll(".ticket");
    for (let i = 0; i < alltickets.length; i++) {
      alltickets[i].remove();
    }

    filterdtickets.forEach(function (filteredtck) {
      createticket(
        filteredtck.inputtext,
        filteredtck.colorselected,
        filteredtck.id
      );
    });
  });

  allclrs[i].addEventListener("dblclick", function () {
    let alltickets = document.querySelectorAll(".ticket");
    for (let i = 0; i < alltickets.length; i++) {
      alltickets[i].remove();
    }
    ticketarr.forEach(function (filteredtck) {
      createticket(
        filteredtck.inputtext,
        filteredtck.colorselected,
        filteredtck.id
      );
    });
  });
}

// getting the index for the lock clicked

function getidx(tkid) {
  let idx = ticketarr.findIndex(function (tktobj) {
    return tktobj.id == tkid;
  });
  return idx;
}
