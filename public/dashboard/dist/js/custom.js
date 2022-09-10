$(function () {
  "use strict";

  $(".preloader").fadeOut();
  // this is for close icon when navigation open in mobile view
  $(".nav-toggler").on("click", function () {
    $("#main-wrapper").toggleClass("show-sidebar");
  });
  $(".search-box a, .search-box .app-search .srh-btn").on("click", function () {
    $(".app-search").toggle(200);
    $(".app-search input").focus();
  });

  // ==============================================================
  // Resize all elements
  // ==============================================================
  $("body, .page-wrapper").trigger("resize");
  $(".page-wrapper").delay(20).show();

  //****************************
  /* This is for the mini-sidebar if width is less then 1170*/
  //****************************
  var setsidebartype = function () {
    var width = window.innerWidth > 0 ? window.innerWidth : this.screen.width;
    if (width < 1170) {
      $("#main-wrapper").attr("data-sidebartype", "mini-sidebar");
    } else {
      $("#main-wrapper").attr("data-sidebartype", "full");
    }
  };
  $(window).ready(setsidebartype);
  $(window).on("resize", setsidebartype);
});

$("#addExpenditure").click({
  
})
$("#land-data").on("change",()=>{
  let landData = userData.land[$("#land-data").val()];
  let exp=``;
  landData.expenditure.forEach((e,i)=>{
    exp+=`
      <tr>
        <th scope="row">${i+1}</th>
        <td>${e.date}</td>
        <td>${e.name}</td>
        <td>${e.quantity}</td>
        <td>${e.rate}</td>
        <td><button onclick="removeExp(${i})" class="btn btn-danger"><img src="https://img.icons8.com/ios-glyphs/20/000000/filled-trash.png"/></button></td>
    </tr>
    `
  })
  $("#expenditure-data").html(exp)
  let sales=``;
  landData.sales.forEach((e,i)=>{
    sales+=`
      <tr>
        <th scope="row">${i+1}</th>
        <td>${e.date}</td>
        <td>${e.product}</td>
        <td>${e.rate}</td>
        <td>${e.profit}</td>
      </tr>
    `
  })
  $("#sales-data").html(sales)
})
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

var updateData = async (data) =>{
  return new Promise((res,rej)=>{
    $.ajax({
        type: 'POST',
        url:`/setUserDetails/${getCookie('userToken')}/`,
        data: JSON.stringify({newData:data}),
        contentType: "application/json",
        dataType: 'json'
    }).then(async (response)=>{
      if(response.error) res(await updateData(data));
      else res("Data Updated");
    })
  })
}
var removeExp = async (i)=>{
  userData.land[$("#land-data").val()].expenditure.splice(i,1);
  $(".loader").show();
  await updateData(userData);
  let landData = userData.land[$("#land-data").val()];
  let exp=``;
  landData.expenditure.forEach((e,i)=>{
    exp+=`
      <tr>
        <th scope="row">${i+1}</th>
        <td>${e.date}</td>
        <td>${e.name}</td>
        <td>${e.quantity}</td>
        <td>${e.rate}</td>
        <td><button onclick="removeExp(${i})" class="btn btn-danger"><img src="https://img.icons8.com/ios-glyphs/20/000000/filled-trash.png"/></button></td>
    </tr>
    `
  })
  $("#expenditure-data").html(exp)
  $(".loader").hide()
}
$(".loader").hide()

var addExp = async () =>{
  Swal.fire({
    title: 'New Expenditure',
    html: `
      <input type="text" id="service" class="swal2-input" placeholder="Service">
      <input type="number" id="quantity" class="swal2-input" placeholder="Quantity">
      <input type="number" id="rate" class="swal2-input" placeholder="Rate">
      <input type="date" id="date" class="swal2-input" placeholder="Date">
    `,
    confirmButtonText: 'Add Expenditure',
    focusConfirm: false,
    allowOutsideClick: false,
    preConfirm: () => {
      const name = Swal.getPopup().querySelector('#service').value
      const quantity = Swal.getPopup().querySelector('#quantity').value
      const rate = Swal.getPopup().querySelector('#rate').value
      const date = Swal.getPopup().querySelector('#date').value
      if (!service || !quantity || !rate || !date) {
        Swal.showValidationMessage(`Please enter all input fields`)
      }
      return { name,quantity,rate,date }
    }
  }).then(async (result) => {
    userData.land[$("#land-data").val()].expenditure.push(result.value);
    $(".loader").show();
    await updateData(userData);
    let landData = userData.land[$("#land-data").val()];
    let exp=``;
    landData.expenditure.forEach((e,i)=>{
      exp+=`
        <tr>
          <th scope="row">${i+1}</th>
          <td>${e.date}</td>
          <td>${e.name}</td>
          <td>${e.quantity}</td>
          <td>${e.rate}</td>
          <td><button onclick="removeExp(${i})" class="btn btn-danger"><img src="https://img.icons8.com/ios-glyphs/20/000000/filled-trash.png"/></button></td>
      </tr>
      `
    })
    $("#expenditure-data").html(exp)
    $(".loader").hide()
    Swal.fire(`Expense Added`)
  })
  
}

var addSale = async () =>{
  Swal.fire({
    title: 'New Sale',
    html: `
      <input type="text" id="buyer" class="swal2-input" placeholder="Buyer Name">
      <input type="text" id="saleName" class="swal2-input" placeholder="Sale Name">
      <input type="number" id="rate" class="swal2-input" placeholder="Amount">
      <input type="date" id="date" class="swal2-input" placeholder="Date">
    `,
    confirmButtonText: 'Add Sale',
    focusConfirm: false,
    allowOutsideClick: false,
    preConfirm: () => {
      const buyer = Swal.getPopup().querySelector('#buyer').value
      const product = Swal.getPopup().querySelector('#saleName').value
      const amount = parseInt(Swal.getPopup().querySelector('#rate').value)
      const date = Swal.getPopup().querySelector('#date').value
      if (!buyer || !product || !amount || !date) {
        Swal.showValidationMessage(`Please enter all input fields`)
      }
      return { buyer,product,amount,date }
    }
  }).then(async (result) => {
    result.value["profit"]=result.value.amount - userData.land[$("#land-data").val()].expenditure.reduce((partialSum, a) => parseInt(partialSum) +  parseInt(a.rate), 0);
    result.value["expenditure"]=JSON.parse(JSON.stringify(userData.land[$("#land-data").val()].expenditure));
    userData.land[$("#land-data").val()].expenditure=[];
    userData.land[$("#land-data").val()].sales.push(result.value);
    $(".loader").show();
    await updateData(userData);
    let landData = userData.land[$("#land-data").val()];
    let sales=``;
    landData.sales.forEach((e,i)=>{
      sales+=`
        <tr>
          <th scope="row">${i+1}</th>
          <td>${e.date}</td>
          <td>${e.product}</td>
          <td>${e.amount}</td>
          <td>${e.profit}</td>
        </tr>
      `
    })
    $("#sales-data").html(sales)
    let exp=``;
    landData.expenditure.forEach((e,i)=>{
      exp+=`
        <tr>
          <th scope="row">${i+1}</th>
          <td>${e.date}</td>
          <td>${e.name}</td>
          <td>${e.quantity}</td>
          <td>${e.rate}</td>
          <td><button onclick="removeExp(${i})" class="btn btn-danger"><img src="https://img.icons8.com/ios-glyphs/20/000000/filled-trash.png"/></button></td>
      </tr>
      `
    })
    $("#expenditure-data").html(exp)
    chart.update({
      labels: userData.land[$("#land-data").val()].sales.map((e)=>e.date),
      series: [
        userData.land[$("#land-data").val()].sales.map((e)=>e.amount),
        userData.land[$("#land-data").val()].sales.map((e)=>e.profit)
      ]
    })
    $(".loader").hide()
    Swal.fire(`Sale Added`)
  })
  
}

var addLand = ()=>{
  
  Swal.fire({
    title: 'New Land',
    html: `
      <input type="number" id="area" class="swal2-input" placeholder="Area">
      <input type="text" id="crop" class="swal2-input" placeholder="Crop">
      <input type="text" id="name" class="swal2-input" placeholder="Name">
    `,
    confirmButtonText: 'Add Land',
    focusConfirm: false,
    allowOutsideClick: false,
    preConfirm: () => {
      const area = parseInt(Swal.getPopup().querySelector('#area').value)
      const crop = Swal.getPopup().querySelector('#crop').value
      const name = Swal.getPopup().querySelector('#name').value
      if (!area || !crop || !name) {
        Swal.showValidationMessage(`Please enter all input fields`)
      }
      return { area,crop,name }
    }
  }).then(async (result) => {
    result.value.sales=[];
    result.value.expenditure=[];
    userData.land.push(result.value)
    $(".loader").show();
    await updateData(userData);
    $("#land-data").html(userData.land.map((e,i)=>`<option value="${i}">${e.name}</option>`).join(" "))
    $(".loader").hide()
    Swal.fire(`Land Added`)
  })
}

if(userData.land.length==0)addLand();

var data = {
  labels: userData.land.length>0?userData.land[$("#land-data").val()].sales.map((e)=>e.date):[],
  series: [
    userData.land.length>0?userData.land[$("#land-data").val()].sales.map((e)=>e.amount):[],
    userData.land.length>0?userData.land[$("#land-data").val()].sales.map((e)=>e.profit):[]
  ]
};

var options = {
  seriesBarDistance: 10
};

var responsiveOptions = [
  ['screen and (max-width: 640px)', {
    seriesBarDistance: 5,
    axisX: {
      labelInterpolationFnc: function (value) {
        return value[0];
      }
    }
  }]
];

var chart=new Chartist.Bar('#ct-chart', data, options, responsiveOptions);

const dashboard = document.getElementById('landManagement')
const shop = document.getElementById('shopping')
const loans = document.getElementById('loans')
const orders = document.getElementById('orders')
function routeToShop() {
    loans.style.display = 'none'
    shop.style.display = 'block'
    orders.style.display = 'none'
    dashboard.style.display = 'none'
}
function routeToDashboard() { 
  loans.style.display = 'none'
  shop.style.display = 'none'
  orders.style.display = 'none'
  dashboard.style.display = 'block'
}
function routeToLoans() {
    loans.style.display = 'block'
    shop.style.display = 'none'
    orders.style.display = 'none'
    dashboard.style.display = 'none'
}
function routeToOrders() {
    loans.style.display = 'none'
    shop.style.display = 'none'
    orders.style.display = 'block'
    dashboard.style.display = 'none'
}

