// Hàm kiểm tra và lấy giá trị cookie
var device_id = 'ws_1777041042219';
var murl_c;
let url;
function getCookie(name) {
  let nameEQ = name + "=";
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Kiểm tra xem cookie 'device_id' có tồn tại không

const deviceId = getCookie('device_id');
if (deviceId) {

  // Thực hiện hành động nếu cookie tồn tại
//  device_id = deviceId;
} else {
  // Thực hiện hành động nếu cookie không tồn tại
}

const urlId = getCookie('action_url');
if (urlId) {
  // Thực hiện hành động nếu cookie tồn tại
  url = urlId;
} else {

  // Thực hiện hành động nếu cookie không tồn tại
}

const murl = getCookie('murl');
if (murl) {
  // Thực hiện hành động nếu cookie tồn tại
  murl_c = murl;
} else {
  // Thực hiện hành động nếu cookie không tồn tại
}

// Function to toggle the status of activity

// Hàm lấy ngày tháng năm hiện tại và tạo biến
function getCurrentDate() {
  var today = new Date(); // Lấy ngày giờ hiện tại
  var day = today.getDate().toString().padStart(2, '0'); // Lấy ngày và đảm bảo 2 chữ số
  var month = (today.getMonth() + 1).toString().padStart(2, '0'); // Lấy tháng và đảm bảo 2 chữ số (tháng bắt đầu từ 0)
  var year = today.getFullYear(); // Lấy năm

  var fullDate = day + +month + +year; // Ghép ngày, tháng, năm thành một chuỗi
  return fullDate; // Trả về kết quả
}

// Tạo biến ngày tháng năm
let currentDate = getCurrentDate();

function addRow1(status, id, time, balance, info) {
    let tableBody = document.getElementById('data-table-body');
    let row = document.createElement('tr');

    if (status == 0)
        row.innerHTML = `
            <td class="content-green">${id}</td>
            <td class="content-green">${unixToTime(time)}</td>
            <td class="content-green">${balance}</td>
            <td class="content-green">${info}</td>
        `;
    else
        row.innerHTML = `
            <td class="content-red">${id}</td>
            <td class="content-red">${unixToTime(time)}</td>
            <td class="content-red">${balance}</td>
            <td class="content-red">${info}</td>
        `;

    tableBody.insertBefore(row, null);
}
function addRow(status, id, time, balance, info) {

    let tableBody = document.getElementById('data-table-body');
    let row = document.createElement('tr');

    row.setAttribute("data-ts", time); // lưu timestamp

    let color = status == 0 ? "content-green" : "content-red";

    row.innerHTML = `
        <td class="${color}">${id}</td>
        <td class="${color}">${unixToTime(time)}</td>
        <td class="${color}">${balance}</td>
        <td class="${color}">${info}</td>
    `;

    let rows = tableBody.querySelectorAll("tr");
    let inserted = false;

    for (let oldRow of rows) {
        let oldTs = parseInt(oldRow.getAttribute("data-ts"));

        // mới hơn thì chèn lên trên
        if (time > oldTs) {
            tableBody.insertBefore(row, oldRow);
            inserted = true;
            break;
        }
    }

    // nếu cũ nhất thì thêm cuối
    if (!inserted) {
        tableBody.appendChild(row);
    }
}
function clearTable() {
  // Lấy phần tử tbody của bảng
  let tableBody = document.getElementById('data-table-body');

  // Kiểm tra nếu tbody tồn tại
  if (tableBody) {
    // Xóa sạch các nội dung bên trong tbody
    tableBody.innerHTML = '';
  }
}

function controller(topic, msg) {
console.log(topic);
  console.log(msg);
  if (topic.search("log/ws/9999/8888") != -1) {
    let parts = topic.split("/");
    if (isTodayFromPart5(parts[5]) == false) {
      return;
    }
    console.log("✅ Là hôm nay");
    let obj = JSON.parse(msg);
    addRow(obj.status == "SUCCESS" ? 0 : 1, obj.id, obj.ts, obj.amount, obj.msg);
    calculateTotal();
  } else if (topic.search("/lwt") != -1) {
    if (topic.search("/server/lwt") != -1) {
      const phone_status = document.getElementById("phone-status-text");
       const phoneIcon = document.getElementById("phone-status-icon");
     //   console.log("✅ server");
      if (msg == "ONLINE") {
       
        phone_status.innerHTML = "ONLINE";
        phone_status.classList.remove("text-danger");
       phone_status.classList.add("text-success");
        phoneIcon.src = "https://cdn-icons-png.flaticon.com/512/190/190411.png";
      } else {
         
        phone_status.innerHTML = "OFFLINE";
        phone_status.classList.remove("text-success");
        phone_status.classList.add("text-danger");
        phoneIcon.src = "https://cdn-icons-png.flaticon.com/512/565/565547.png";
      }
    } else {
  //console.log("✅ device");
      const dvStatus = document.getElementById("device-status-text");
      const dvIcon = document.getElementById("device-status-icon");
      if (msg == "ONLINE") {
        dvStatus.innerHTML = "ONLINE";
        dvStatus.classList.remove("text-danger");
        dvStatus.classList.add("text-success");
        dvIcon.src = "https://cdn-icons-png.flaticon.com/512/190/190411.png";
      } else {
        dvStatus.innerHTML = "OFFLINE";
        dvStatus.classList.remove("text-success");
        dvStatus.classList.add("text-danger");
        dvIcon.src = "https://cdn-icons-png.flaticon.com/512/565/565547.png";
      }
    }
  } else if (topic.search("/state") != -1) {
    const uptime = document.getElementById("uptime");
    const device_wifi = document.getElementById("device-wifi");
    const rssi = document.getElementById("rssi");
   
    const last_update = document.getElementById("last-update");
    const mode = document.getElementById("mode");
   
    const dv_time = document.getElementById("device-status-time");
    const bt = document.getElementById("battery-level");
    let obj = JSON.parse(msg);
    uptime.innerHTML = formatUptime(obj.uptime);
    device_wifi.innerHTML = obj.ssid;
    rssi.innerHTML = obj.rssi;
    last_update.innerHTML = formatUptime(obj.phone.last_update);
    dv_time.innerHTML = " ( " + formatUptime(obj.time) + " ) ";
    bt.innerText = obj.phone.battery + ' %';
   

    if (obj.mode == 0) {
      if (obj.status == 0) mode.innerHTML = "Đang chờ";
      if (obj.status == 1) mode.innerHTML = "Đang chạy";
    } else mode.innerHTML = "Đang bảo trì";

  }
}

function calculateTotal() {
  let total = 0;

  // Lấy tất cả các hàng từ bảng
  const rows = document.querySelectorAll("#data-table-body tr");
  rows.forEach(row => {
    // Lấy giá trị của cột "Biến động"
    const cell = row.querySelector("td:nth-child(3)"); // Cột thứ 3 (Biến động)
    if (cell && cell.textContent.trim() !== "") { // Kiểm tra ô không trống
      // Lấy giá trị và loại bỏ ký tự "+" và ","
      let value = cell.textContent.trim().replace(/,/g, '').replace('+', '');

      // Chuyển sang số và cộng vào tổng
      total += parseInt(value, 10); // Sử dụng parseFloat nếu cần hỗ trợ số thực
    }
  });

  // Cập nhật tổng vào phần tử hiển thị
  const totalDisplay = document.getElementById("total-display");
  totalDisplay.textContent = `:${total.toLocaleString()} VNĐ`; // Hiển thị với dấu phân cách số
}

// Gọi hàm tính toán sau khi bảng được cập nhật

// Gọi hàm tính toán sau khi bảng được cập nhật
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}
window.onload = function() {
  const id = getQueryParam('i'); // Lấy giá trị tham số 'i'
  const token = getQueryParam('t'); // Lấy giá trị tham số 't'
  const mu = getQueryParam('m');
  if (id) {
    setCookie('device_id', id, 365); // Lưu id vào cookie trong 365 ngày
  }
  if (token) {
    setCookie('action_url', token, 365); // Lưu token vào cookie trong 365 ngày
  }
  if (mu) {
    setCookie('murl', mu, 365); // Lưu token vào cookie trong 365 ngày
  }
};

// Hàm cập nhật mức pin
function updateBatteryLevel(level) {
  const batteryLevel = document.getElementById("battery-level");
  const batteryIcon = document.getElementById("battery-icon");

  // Cập nhật mức pin hiển thị
  batteryLevel.textContent = `$ {
    level
  } % `;

  // Thay đổi icon dựa trên mức pin
  if (level >= 80) {
    batteryIcon.src = "https://cdn-icons-png.flaticon.com/512/3103/3103446.png"; // Pin đầy
  } else if (level >= 50) {
    batteryIcon.src = "https://cdn-icons-png.flaticon.com/512/3103/3103453.png"; // Pin trung bình
  } else if (level >= 20) {
    batteryIcon.src = "https://cdn-icons-png.flaticon.com/512/3103/3103450.png"; // Pin yếu
  } else {
    batteryIcon.src = "https://cdn-icons-png.flaticon.com/512/3103/3103478.png"; // Pin rất yếu
  }
}

// Hàm cập nhật trạng thái sạc
function updateChargingStatus(isCharging) {
  const chargingStatus = document.getElementById("charging-status");
  const chargingIcon = document.getElementById("charging-icon");

  // Cập nhật trạng thái sạc
  if (isCharging) {
    chargingStatus.textContent = "Đang sạc";
    chargingIcon.src = "https://cdn-icons-png.flaticon.com/512/724/724664.png"; // Icon đang sạc
  } else {
    chargingStatus.textContent = "Không sạc";
    chargingIcon.src = "https://cdn-icons-png.flaticon.com/512/1828/1828778.png"; // Icon không sạc
  }
}

// Ví dụ sử dụng:
// updateBatteryLevel(65);      // Mức pin 65%
// updateChargingStatus(true);  // Đang sạc
// updateBatteryLevel(95);      // Mức pin 15%
// updateChargingStatus(false); // Không sạc
