"use strict";

// Defer in HTML allows us to grab these immediately at the top
const $ = selector => document.querySelector(selector);

const nameIn    = $("#client_name");
const emailIn   = $("#email");
const investIn  = $("#investment");
const addIn     = $("#monthly_add");
const rateIn    = $("#rate");
const dateIn    = $("#retirement_date");
const errBox    = $("#error_message");
const statusMsg = $("#status_message");
const output    = $("#projection_output");
const form      = $("#projection_form");
const testData  = $("#test_data");

let projectionTimer = null;

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

const processEntries = (evt) => {
    let isValid = true;
    let years = 0;
    evt.preventDefault();
    resetForm()

    const name = nameIn.value.trim();
    const count = (name) => name.trim().split(/\s+/).length;
    if (count(name) <= 1){
        isValid = false;
        document.getElementById("name_error").textContent = "Please enter your first and last name.";
    } else {
        document.getElementById("name_error").textContent = "*";
    }

    const email = emailIn.value.trim();
    if (!email.includes("@wsc.edu")){
        isValid = false;
        document.getElementById("email_error").textContent = "Please enter a valid email address.";
    } else {
        document.getElementById("email_error").textContent = "*";
    }

    const date = dateIn.value.slice(0, 4);
    const current = new Date();
    if (date - current.getFullYear() <= 0 || date - current.getFullYear() > 70){
        isValid = false;
        document.getElementById("retire_date_error").textContent = "Please enter a valid date.";
    } else {
        document.getElementById("retire_date_error").textContent = "*";
    }

    const saving = investIn.value.trim();
    if (saving <= 0 || saving === ''){
        isValid = false;
        document.getElementById("investment_error").textContent = "Current savings total, not less than 0.";
    } else {
        document.getElementById("investment_error").textContent = "*";
    }

    const monthly = addIn.value.trim();
    if (monthly <= 0 || monthly === ""){
        isValid = false;
        document.getElementById("add_error").textContent = "How much you add each month, not less than 0.";
    }

    const interest = rateIn.value.trim();
    if (interest <= 0 || interest === ""){
        isValid = false;
        document.getElementById("rate_error").textContent = "Annual interest rate, not less than 0 or greater than 20.";
    }

    try {
        if (!isValid) throw "Please correct the entries highlighted below.";
        document.body.style.width = "350px";
        startProjection(nameIn.value, saving, monthly, interest, years);
    } catch(err){
        document.body.style.width = "750px";
        errBox.innterText = err.message
    }

};

const startProjection = (name, bal, add, rate, years) => {
    statusMsg.textContent = `Live Projection: ${name}`;
    statusMsg.style.color = "red";
    let count = 1;

    const startYear = new Date().getFullYear();

    let formattedBal = formatter.format(bal);
    output.innerHTML = `Year ${startYear} = ${formattedBal}`;

    projectionTimer = setInterval(() => {
        for (let i = 0; i < 12; i++) {
            bal = ((bal + add) * (1 + (rate / 12 / 100))).toFixed(2);
        }
        formattedBal = formatter.format(bal);
        output.innerHTML = `Year ${startYear} = ${formattedBal}`;

        if (count >= years){
            clearInterval(projectionTimer);
            statusMsg.textContent = 'Calculation Completed!';
            statusMsg.style.color = "red";
        }
        count++;
    })
};

const setTestData = () => {
    resetForm();
    const today = new Date()
    today.setFullYear(today.getFullYear() + 10);
    const future = today.toISOString().split("T")[0];
    document.getElementById("client_name").value = "Joe Smith";
    document.getElementById("email").value = "josmith1@wsc.edu";
    document.getElementById("investment").value = "100000";
    document.getElementById("monthly_add").value = "500";
    document.getElementById("rate").value = "5.5";
    document.getElementById("retirement_date").value = future;
    console.log(future);
};

const resetForm = () => {
    errBox.textContent = "";
    output.textContent = "";
    statusMsg.textContent = "";
    clearInterval(projectionTimer);
    document.querySelectorAll(".error").forEach(s => s.textContent = "*");
    document.body.style.width = "350px";
    statusMsg.style.color = "red";
    document.getElementById("client_name").focus();
};

document.addEventListener("DOMContentLoaded", () => {
    form.addEventListener("submit", processEntries);
    form.addEventListener("reset", resetForm);
    testData.addEventListener("click", setTestData);
});