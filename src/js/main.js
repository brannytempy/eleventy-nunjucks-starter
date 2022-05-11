$(document).ready(function() {
    
    $('#toc').on('click', '#toggle-toc', function () {
        $('#toc').toggleClass('hidden');
    });
    $('#toc').on('click', 'a', function () {
        $('#toc').addClass('hidden');
    });
    
});