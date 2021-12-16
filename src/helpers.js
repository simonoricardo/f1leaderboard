// ----------------------------
// LOCAL STORAGE CRUD FUNCTIONS
// ----------------------------
function fetchAllLapTimes() {
    if (!localStorage.getItem('allLapTimes')){
        localStorage.setItem('allLapTimes', JSON.stringify([]));
    }
    let allLapTimesString = localStorage.getItem('allLapTimes');
    return JSON.parse(allLapTimesString);
}

function setAllLapTimes(allLapTimes) {
    localStorage.setItem('allLapTimes', JSON.stringify(allLapTimes));
}

function fetchCurrentEvent(){
    let currentEventId = Number(localStorage.getItem('currentEventId'));
    let allEvents = fetchAllEvents();
    return allEvents.find(event => event.id === currentEventId);
}

function setCurrentEvent(event){
    let allEvents = fetchAllEvents();
    let currentEventId = event.id;
    // replace the current event with the new event
    let index = allEvents.findIndex(event => event.id === currentEventId);
    allEvents[index] = event;
    setAllEvents(allEvents);
}

function fetchAllEvents(){
    if (!localStorage.getItem('events')){
        localStorage.setItem('events', JSON.stringify([]));
    }
    let allEventsString = localStorage.getItem('events');
    return JSON.parse(allEventsString);
}

function setAllEvents(allEvents){
    localStorage.setItem('events', JSON.stringify(allEvents));
}

function fetchFastestLapTimes() {
    if (!localStorage.getItem('fastestLapTimes')){
        localStorage.setItem('fastestLapTimes', JSON.stringify([]));
    }
    let fastestLapTimesString = localStorage.getItem('fastestLapTimes');
    return JSON.parse(fastestLapTimesString);
}

function setFastestLapTimes(fastestLapTimes) {
    localStorage.setItem('fastestLapTimes', JSON.stringify(fastestLapTimes));
}

function fetchDriverLaps() {
    if (!localStorage.getItem('driverLaps')){
        localStorage.setItem('driverLaps', JSON.stringify([]));
    }
    let driverLapsString = localStorage.getItem('driverLaps');
    return JSON.parse(driverLapsString);
}

function setDriverLaps(driverLaps) {
    localStorage.setItem('driverLaps', JSON.stringify(driverLaps));
}

function fetchAllLapTimesCurrentEvent(){
    if (!localStorage.getItem('allLapTimesCurrentEvent')){
        localStorage.setItem('allLapTimesCurrentEvent', JSON.stringify([]));
    }
    let allLapTimes = fetchAllLapTimes();
    let allLapTimesEvent = getAllLapTimesEvent(allLapTimes, currentEvent.id);
    setAllLapTimesCurrentEvent(allLapTimesEvent);
    return allLapTimesEvent;
}

function setAllLapTimesCurrentEvent(lapTimesEvent){
    localStorage.setItem('allLapTimesCurrentEvent', JSON.stringify(lapTimesEvent));
}

function setTimesFromDriver(driverNumber) {
    let allLapTimes = fetchAllLapTimes();
    let driverLaps = [];
    allLapTimes.forEach(lapData => {
        if (lapData.driverNumber === driverNumber) {
            driverLaps.push(lapData);
        }
    })
    localStorage.setItem('driverLaps', JSON.stringify(driverLaps));
}


// ----------------
// HELPER FUNCTIONS
// ----------------

function setEventListeners(){
    addButton.addEventListener("click", handleAddTime)

    editTitleIcon.addEventListener("click", handleEditLeaderboardTitle);

    tracksSelect.addEventListener("change", () => {
        currentEvent.track = tracksSelect.value;
        setCurrentEvent(currentEvent);
    });

    deleteEvent.addEventListener("click", showDeleteEventModal);

    confirmDeleteEvent.addEventListener("click", () => {
        handleDeleteEvent(currentEvent.id);
    });

    cancelDeleteEvent.addEventListener("click", hideDeleteEventModal);

    closeDeleteEventModal.addEventListener("click", hideDeleteEventModal);

    blackBg2.addEventListener("click", hideDeleteEventModal);

    blackBg.addEventListener('click', hideDriverModal);

    blurBg.addEventListener('click',  handleCancelDeleteTimeModal);

    closeDriverModal.addEventListener('click',  hideDriverModal);

    closeDeleteTimeModal.addEventListener('click', handleCancelDeleteTimeModal);
}

function getHelmetImage(driverNumber) {
    const driverName = getDriverName(driverNumber);
    const helmet = document.createElement("img");
    helmet.src = drivers.find(driver => driver.name === driverName).helmet;
    helmet.classList.add("helmet-img");
    helmet.alt = `${driverName} helmet`;
    return helmet;
}

function getDriverName(driverNumber) {
    return drivers.find(driver => driver.number === driverNumber).name;
}

function getDriverTeam(driverNumber) {
    return drivers.find(driver => driver.number === driverNumber).team;
}

function getTeamImage(driverNumber) {
    const teamName = getDriverTeam(driverNumber);
    const teamImage = document.createElement("img");
    teamImage.src = teams.find(team => team.name === teamName).image;
    teamImage.classList.add("team-img");
    teamImage.alt = `${teamName} car`;
    return teamImage;
}

function getDriversFromLaptimes(times) {
    const drivers = [];
    times.forEach(time => {
        if (!drivers.includes(time.driverNumber)) {
            drivers.push(time.driverNumber);
        }
    });
    return drivers;
}

function getLapCountForDriver(driverNumber){
    let allLapTimes = fetchAllLapTimes();
    let lapCount = 0;
    allLapTimes.forEach(time => {
        if (time.driverNumber === driverNumber) {
            lapCount++;
        }
    });
    return lapCount;
}

function getCurrentLapId(){
    let allLapTimes = fetchAllLapTimes();
    let lapId = 0;
    allLapTimes.forEach(lapTime => {
        if (lapTime.id >= lapId) {
            lapId = lapTime.id;
        }
    });
    return lapId;
}

function getAllLapTimesEvent(allLapTimes, eventId){
    let eventLapTimes = [];
    allLapTimes.forEach(lapTime => {
        if (lapTime.eventId === eventId) {
            eventLapTimes.push(lapTime);
        }
    });
    return eventLapTimes;
}

function deleteSingleLap(lapId, tableRoot) {
    // delete a single lap from allLapTimes and driverLaps,
    // update localStorage then update leaderboard
    let allLapTimes = fetchAllLapTimes();

    allLapTimes.forEach(lapData => {
        if (lapData.id === lapId) {
            allLapTimes.splice(allLapTimes.indexOf(lapData), 1);
        }
    })
    const driverLapsString = localStorage.getItem('driverLaps');
    const driverLaps = JSON.parse(driverLapsString);
    driverLaps.forEach(lap => {
        if (lap.id === lapId) {
            driverLaps.splice(driverLaps.indexOf(lap), 1);
        }
    })

    setDriverLaps(driverLaps);
    setAllLapTimes(allLapTimes);
    updateLeaderboard(tableRoot);
}

function updateLapTime(updatedLap, tableRoot) {
    // find and replace the lap time in local storage,
    // allLapTimes and driverLaps, then update the leaderboard
    const allLapTimes = fetchAllLapTimes();
    const driverLaps = fetchDriverLaps();
    findAndReplaceLap(updatedLap, allLapTimes);
    findAndReplaceLap(updatedLap, driverLaps);
    setDriverLaps(driverLaps);
    setAllLapTimes(allLapTimes);
    updateLeaderboard(tableRoot);
}

function findAndReplaceLap(updatedLap, laps) {
    laps.forEach(lap => {
        if (lap.id === updatedLap.id) {
            lap.time.minutes = updatedLap.time.minutes;
            lap.time.seconds = updatedLap.time.seconds;
            lap.time.fractions = updatedLap.time.fractions;
            lap.tyres = updatedLap.tyres;
        }
    })
}

function createLeaderboardRow(){
    return {
        driverNumberCell: document.createElement("td"),
        driverHelmetCell: document.createElement("td"),
        driverNameCell: document.createElement("td"),
        driverTeamCell: document.createElement("td"),
        teamImageCell: document.createElement("td"),
        timeCell: document.createElement("td"),
        gapCell: document.createElement("td"),
        tyreCell: document.createElement("td"),
        lapCell: document.createElement("td")
    }
}

function createModalRow(){
    return {
        lapCountCell: document.createElement('td'),
        lapTimeCell: document.createElement('td'),
        gapCell: document.createElement('td'),
        tyreCell: document.createElement('td'),
        editCell: document.createElement('td'),
    }
}

// ----------------------
// CALCULATIONS FUNCTIONS
// ----------------------

function getFastestLapsByDrivers(times) {
    const fastestLapTimesByDriver = [];
    const sortedLapTimes = sortTimesByFastest(times);
    const drivers = getDriversFromLaptimes(times);

    // find the fastest lap for each driver
    for (const driver of drivers) {
        const fastestLap = sortedLapTimes.find(lap => lap.driverNumber === driver);
        fastestLapTimesByDriver.push(fastestLap);
    }

    // sort these times by fastest
    return sortTimesByFastest(fastestLapTimesByDriver);
}

function sortTimesByFastest(times) {
    const sortedTimes = [ ...times ];
    return sortedTimes.sort((a, b) => {
        return ((a.time.minutes * 60 * 1000) + (a.time.seconds * 1000) + a.time.fractions) -
            ((b.time.minutes * 60 * 1000) + (b.time.seconds * 1000) + b.time.fractions);
    });
}

function getFastestLap(lapTimes) {
    return sortTimesByFastest(lapTimes)[0];
}

function calculateGapToFastestLap(fastestLap, lapTime) {
    const fastestLapTimeInMs = fastestLap.time.minutes * 60 * 1000 + fastestLap.time.seconds * 1000 + fastestLap.time.fractions;
    const lapTimeInMs = lapTime.minutes * 60 * 1000 + lapTime.seconds * 1000 + lapTime.fractions;
    return fastestLapTimeInMs - lapTimeInMs;
}

// ---------------------
// LEADERBOARD FUNCTIONS
// ---------------------

function addRowToTable(lapData, fastestLap, tableRoot) {
    // get the lap time out, easier to work with
    const lapTime = {
        minutes: lapData.time.minutes,
        seconds: lapData.time.seconds,
        fractions: lapData.time.fractions
    }

    // create the table row
    const tableRow = document.createElement("tr");
    tableRow.addEventListener("click", () => {
        setTimesFromDriver(lapData.driverNumber);
        showDriverModal();
        displayDataModalTable();
    })

    // create a cell for every table column
    const row = createLeaderboardRow();

    // add the data to each row cell
    row.driverNumberCell.innerText = lapData.driverNumber;
    row.driverHelmetCell.appendChild(getHelmetImage(lapData.driverNumber));
    row.driverNameCell.innerText = getDriverName(lapData.driverNumber);
    row.driverTeamCell.innerText = getDriverTeam(lapData.driverNumber);
    row.teamImageCell.appendChild(getTeamImage(lapData.driverNumber));
    row.timeCell.innerText = `${lapData.time.minutes}:${lapData.time.seconds}:${lapData.time.fractions}`;
    row.gapCell.innerText = calculateGapToFastestLap(fastestLap, lapTime) === 0 ? "---" : `+${((calculateGapToFastestLap(fastestLap, lapTime) / 1000) * -1).toFixed(3)}`;
    row.tyreCell.innerText = lapData.tyres;
    row.lapCell.innerText = getLapCountForDriver(lapData.driverNumber);

    // add every cell to the table row
    for (let td in row) {
        tableRow.appendChild(row[td]);
    }

    // add the row to the table
    tableRoot.appendChild(tableRow);
}

function setLeaderboardTitle() {
    const title = document.querySelector(".title");
    title.innerText = currentEvent.title;
}

function updateLeaderboard(tableRoot){
    const allLapTimesCurrentEvent = fetchAllLapTimesCurrentEvent();
    const leaderboardTimes = getFastestLapsByDrivers(allLapTimesCurrentEvent);
    const fastestLap = getFastestLap(leaderboardTimes);
    tableRoot.innerHTML = "";
    leaderboardTimes.forEach(lapData => {
        addRowToTable(lapData, fastestLap, tableRoot)
    })
}

function handleEditLeaderboardTitle(){
    const title = document.querySelector(".title");
    editTitleIcon.classList.remove("isVisible");
    title.classList.add("editable");
    const saveIcon = document.createElement("i");
    saveIcon.classList.add("fas", "fa-save", "save-title", "isVisible");
    editTitleIcon.parentNode.appendChild(saveIcon);
    title.contentEditable = true;
    title.focus();
    saveIcon.addEventListener("click", () => {
        currentEvent.title = title.innerText;
        setCurrentEvent(currentEvent);
        saveIcon.classList.remove("isVisible");
        editTitleIcon.classList.add("isVisible");
        title.classList.remove("editable");
    });
}

function disableTrackSelectionField(){
    tracksSelect.disabled = true;
    // add edit icon if disabled
    let editIcon = document.createElement("i");
    editIcon.classList.add("fas", "fa-edit", "edit-track", "isVisible");
    tracksSelect.parentNode.insertBefore(editIcon, tracksSelect.nextSibling);
    // add save icon if not disabled
    let saveTrackIcon = document.createElement("i");
    saveTrackIcon.classList.add("fas", "fa-save", "save-track");
    tracksSelect.parentNode.insertBefore(saveTrackIcon, tracksSelect.nextSibling);

    // add respective event listeners
    editIcon.addEventListener("click", () => {
        tracksSelect.disabled = false;
        editIcon.classList.remove("isVisible");
        saveTrackIcon.classList.add("isVisible");
    });
    saveTrackIcon.addEventListener("click", () => {
        tracksSelect.disabled = true;
        editIcon.classList.add("isVisible");
        saveTrackIcon.classList.remove("isVisible");
    });
}

function clearFieldsValue(){
    const fieldsString = localStorage.getItem("fieldsValue");
    const fields = JSON.parse(fieldsString);
    fields.minutes = "";
    fields.seconds = "";
    fields.fractions = "";
    fields.tyres = "S";
    updateFields(fields);
    localStorage.setItem("fieldsValue", JSON.stringify(fields));
}

function updateFields(fieldsValue){
    driversSelect.value = fieldsValue.driversSelect;
    minutes.value = fieldsValue.minutes;
    seconds.value = fieldsValue.seconds;
    fractions.value = fieldsValue.fractions;
    tyres.value = fieldsValue.tyres;
}

function addEventListenersToForm(form, type, fieldsValue){
    form.addEventListener(type, () => {
        setFieldValues(fieldsValue);
    })
}

function setFieldValues(fieldsValue){
    fieldsValue = {
        driversSelect: driversSelect.value,
        minutes: minutes.value,
        seconds: seconds.value,
        fractions: fractions.value,
        tyres: tyres.value
    };
    localStorage.setItem("fieldsValue", JSON.stringify(fieldsValue));
}

function getLapTimeDetails(){
    return {
        id: ++currentLapId,
        driverNumber: Number(driversSelect.value),
        time: {
            minutes: Number(minutes.value),
            seconds: Number(seconds.value),
            fractions: Number(fractions.value)
        },
        tyres: tyres.value,
        eventId: currentEvent.id
    }
}

function handleAddTime(event){
    event.preventDefault();
    let allLapTimes = fetchAllLapTimes();
    let currentEvent = fetchCurrentEvent();
    if (!currentEvent.track) {
        currentEvent.track = tracksSelect.value;
        disableTrackSelectionField();
        setCurrentEvent(currentEvent);
    }
    const lapTimeDetails = getLapTimeDetails();

    allLapTimes.push(lapTimeDetails);
    let allLapTimesEvent = getAllLapTimesEvent(allLapTimes, currentEvent.id);
    let fastestLapTimes = getFastestLapsByDrivers(allLapTimesEvent);

    setAllLapTimes(allLapTimes);
    setFastestLapTimes(fastestLapTimes);
    setAllLapTimesCurrentEvent(allLapTimesEvent);
    clearFieldsValue();
    updateLeaderboard(leaderboardTableRoot);
}



// ---------------
// MODAL FUNCTIONS
// ---------------

function setModalTitle(driverLaps){
    const modalTitle = document.querySelector(".modal-title");
    modalTitle.innerText = `${driverLaps[0].driverNumber} - ${getDriverName(driverLaps[0].driverNumber)} - ${getDriverTeam(driverLaps[0].driverNumber)}`;
}

function hideDriverModal() {
    driverModal.classList.remove('modal-visible');
    blackBg.classList.remove('blackened-visible');
}

function showDriverModal() {
    driverModal.classList.add('modal-visible');
    blackBg.classList.add('blackened-visible');
}

function handleCancelDeleteTimeModal() {
    deleteTimeModal.classList.remove('modal-visible');
    blurBg.classList.remove('blur-visible');
}

function showDeleteTimeModal() {
    deleteTimeModal.classList.add('modal-visible');
    blurBg.classList.add('blur-visible');
}

function hideDeleteEventModal(){
    deleteEventModal.classList.remove('modal-visible');
    blackBg2.classList.remove('blackened-visible');
}

function showDeleteEventModal(){
    deleteEventModal.classList.add('modal-visible');
    blackBg2.classList.add('blackened-visible');
}

function handleDeleteTimeModal(lapId){
    deleteSingleLap(lapId, leaderboardTableRoot);
    handleCancelDeleteTimeModal();
    // hideDriverModal();
    displayDataModalTable();
}

function addRowToModalTable(lap, lapCount, driverFastestLap){
    const modalRow = document.createElement('tr');
    // setup data for each row
    const rowCells = createModalRow();

    rowCells.lapCountCell.innerText = lapCount;
    rowCells.lapTimeCell.innerText = `${lap.time.minutes}:${lap.time.seconds}:${lap.time.fractions}`;
    rowCells.lapTimeCell.contentEditable = "false"
    rowCells.gapCell.innerText = calculateGapToFastestLap(driverFastestLap, lap.time) === 0 ? "---" : `+${((calculateGapToFastestLap(driverFastestLap, lap.time) / 1000) * -1).toFixed(3)}`;
    rowCells.tyreCell.innerText = lap.tyres;
    rowCells.tyreCell.contentEditable = "false";
    rowCells.editCell.classList.add('edit-cell');

    // create edit/save icon
    let editIcon = createEditIcon(rowCells, lap);
    // create delete icon
    let deleteIcon = createDeleteIcon(lap.id);

    // append icons to the row
    rowCells.editCell.appendChild(editIcon);
    rowCells.editCell.appendChild(deleteIcon);

    // append every cell to the row
    for (let td in rowCells) {
        modalRow.appendChild(rowCells[td]);
    }

    // append row to the modal table
    lapsModalTableRoot.appendChild(modalRow);
}

function handleEditLapTimeModal(rowCells, lap){
    rowCells.lapTimeCell.isContentEditable ? rowCells.lapTimeCell.contentEditable = "false" : rowCells.lapTimeCell.contentEditable = "true";
    rowCells.lapTimeCell.classList.toggle('editable');
    rowCells.tyreCell.isContentEditable ? rowCells.tyreCell.contentEditable = "false" : rowCells.tyreCell.contentEditable = "true";
    rowCells.tyreCell.classList.toggle('editable');
    // update the lap time in the driverLaps array
    // TODO: add validation later
    let updatedLap = {
        id: lap.id,
        time: {
            minutes: Number(rowCells.lapTimeCell.innerText.split(':')[0]),
            seconds: Number(rowCells.lapTimeCell.innerText.split(':')[1]),
            fractions: Number(rowCells.lapTimeCell.innerText.split(':')[2])
        },
        tyres: rowCells.tyreCell.innerText,
        driverNumber: lap.driverNumber
    }
    if (!rowCells.lapTimeCell.isContentEditable) {
        updateLapTime(updatedLap, leaderboardTableRoot);
        displayDataModalTable();
    }
}à


// ------
// OTHERS
// ------

function handleDeleteEvent(eventId){
    // delete event with eventId
    const allEvents = fetchAllEvents();
    allEvents.forEach(event => {
        if (event.id === eventId) {
            allEvents.splice(allEvents.indexOf(event), 1);
        }
    })
    // delete from all laps
    let allLapTimes = fetchAllLapTimes();
    allLapTimes = allLapTimes.filter(lap => {
        return lap.eventId !== eventId
    })

    setAllLapTimes(allLapTimes);
    updateLeaderboard(leaderboardTableRoot);
    setAllEvents(allEvents);
    hideDeleteEventModal();
    window.location.href = "index.html";
}

function createEditIcon(rowCells, lap){
    let editIcon = document.createElement('i');
    document.createElement('i');
    editIcon.classList.add('fas', 'fa-edit');
    editIcon.addEventListener('click', function () { // not using arrow function to access "this"
        // make laptime and tyre cells editable
        handleEditLapTimeModal(rowCells, lap);
        this.classList.toggle('fa-edit');
        this.classList.toggle('fa-check');
    })
    return editIcon;
}

function createDeleteIcon(lapId){
    let deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fas', 'fa-trash-alt');
    deleteIcon.addEventListener('click', () => {
        showDeleteTimeModal();
        confirmDeleteTime.addEventListener('click', () => {
            handleDeleteTimeModal(lapId);
        })

        cancelDeleteTime.addEventListener('click', () => {
            handleCancelDeleteTimeModal();
        })
    })
    return deleteIcon;
}
