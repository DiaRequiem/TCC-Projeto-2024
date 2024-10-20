document.addEventListener('DOMContentLoaded', function () {
    const eventosDiv = document.querySelector('.eventos');

    eventosDiv.addEventListener('click', function () {
        eventosDiv.classList.toggle('expanded');
    });
});

document.addEventListener('DOMContentLoaded', function  () {
    const menuLateral = document.getElementById('menu-lateral');

    menuLateral.addEventListener('mouseover', function () {
        menuLateral.style.width = '400px';
    });
    menuLateral.addEventListener('mouseout', function () {
        menuLateral.style.width = '';    });
});