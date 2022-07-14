$(document).ready(function() {
    tinymce.init({
        selector: '.text-plugin',
        plugins: 'preview powerpaste casechange tinydrive searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link media mediaembed template codesample table charmap pagebreak nonbreaking anchor tableofcontents insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker editimage help formatpainter permanentpen pageembed charmap tinycomments mentions quickbars linkchecker emoticons advtable export',
        language: 'pt_BR'
    });

    $('[data-delete]').click(function() {
        const data = $(this).data();

        $('.modal #btn-delete').attr('href', data.delete);
        $('.modal').css('display', 'flex');
    });

    $('.modal #btn-cancel').click(function() {
        $('.modal #btn-delete').attr('href', '');
        $('.modal').css('display', 'none');
    });
});
