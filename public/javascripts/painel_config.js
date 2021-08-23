window.addEventListener("load", () => {

    const btn = document.querySelector('#btnAddPorta');
    const tbl = document.querySelector('#portas');

    btn.addEventListener('click', () => {
        let novaFileiraEl = document.createElement('tr');
        let id = parseInt(tbl.querySelector('tbody > tr:last-of-type > td:first-of-type').innerText) + 1;
        tbl.querySelector('tbody').append(novaFileiraEl);
        tbl.querySelector('tbody > tr:last-of-type').innerHTML =
            `<td>${id}</td>` +
            `<td><input type="text" name="porta-${id}-nome"></td>` +
            `<td><input type="checkbox" value="true" name="porta-${id}-ativado" checked></td>`;
    });

});