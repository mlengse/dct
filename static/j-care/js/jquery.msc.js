$().ready(function(){
	$("a[rel='iframe']").colorbox({width:"100%", height:"95%", iframe:true, overlayClose:false, loop:false, arrowKey:false});
	$("a[rel='iframed']").colorbox({width:"100%", height:"95%", iframe:true, overlayClose:false, loop:false, arrowKey:false, onClosed:function(){ window.location.reload(); }});
	
	$("#DiseaseNama").watermark("Kode # Nama Diagnosis");
	$("#DiseaseKasus").watermark("Kasus");
	$("#acdrug").watermark("Kode # Nama Obat");
	$("#DrugDosis").watermark("Dosis");
	$("#DrugNama").watermark("Kode # Nama Obat");
	$("#detket").watermark("Keterangan");
	$("#DrugJumlah").watermark("Jml");
	$("#jumlah").watermark("Jml");
	$("#TarifNama").watermark("Kode # Jenis Tarif");
	$("#VisitFrek").watermark("Frek");
	
	$('#UserUsername').focus();	
});

function applyNIK() {
    var data = $.parseJSON( localStorage.getItem('simpus.dukcapil') );
    $("#nama_kk").val(data.nama_kk);
    $("#namapasien").val( data.nama);
    $("#nik").val( data.nik);
    $("#goldar").val( data.kode_goldar).trigger('change');
    $("#tgllahir").val( data.tgl_lahir ).trigger('change');
    $('#jk').val( data.kode_jk ).trigger('change');
    $("#pdk").val( data.kode_pendidikan ).trigger('change');
    $('#pekerjaan').val( data.kode_pekerjaan ).trigger('change');
    $("#alamat").val( data.alamat + ' RT ' + data.rt + ' RW ' + data.rw);
    $("#penyandang_cacat").val( data.penyandang_cacat);

    var kodeDesa = data.kode_propinsi + '.' + data.kode_kabupaten + '.' + data.kode_kecamatan + '.' + data.kode_desa;
    var $desa = $("#desa option[data-dukcapil='"+ kodeDesa +"']");

    if( $desa.length > 0 ){
        $desa.attr("selected","selected").trigger('change');
    }
    else{
        $('#desa').val('99').trigger('change');
    }
    $('#dusun').val( '' ).trigger('change');
}

function getValByOption(id, data){
    return $('#' + id +' option').filter(function () {
        return $(this).html().toUpperCase() == data;
    }).val();
}

//reset
(function($){
    jQuery.fn.reset = function () {
      $(this).each (function() { this.reset(); });
    }
})(jQuery);

//autogrow input
(function($){
    // jQuery autoGrowInput plugin by James Padolsey
    // See related thread: http://stackoverflow.com/questions/931207/is-there-a-jquery-autogrow-plugin-for-text-fields
        
        $.fn.autoGrowInput = function(o) {
            
            o = $.extend({
                maxWidth: 1000,
                minWidth: 0,
                comfortZone: 10
            }, o);
            
            this.filter('input:text').each(function(){
                
                var minWidth = o.minWidth || $(this).width(),
                    val = '',
                    input = $(this),
                    testSubject = $('<tester/>').css({
                        position: 'absolute',
                        top: -9999,
                        left: -9999,
                        width: 'auto',
                        fontSize: input.css('fontSize'),
                        fontFamily: input.css('fontFamily'),
                        fontWeight: input.css('fontWeight'),
                        letterSpacing: input.css('letterSpacing'),
                        whiteSpace: 'nowrap'
                    }),
                    check = function() {
                        
                        if (val === (val = input.val())) {return;}
                        
                        // Enter new content into testSubject
                        var escaped = val.replace(/&/g, '&amp;').replace(/\s/g,'&nbsp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                        testSubject.html(escaped);
                        
                        // Calculate new width + whether to change
                        var testerWidth = testSubject.width(),
                            newWidth = (testerWidth + o.comfortZone) >= minWidth ? testerWidth + o.comfortZone : minWidth,
                            currentWidth = input.width(),
                            isValidWidthChange = (newWidth < currentWidth && newWidth >= minWidth)
                                                 || (newWidth > minWidth && newWidth < o.maxWidth);
                        
                        // Animate width
                        if (isValidWidthChange) {
                            input.width(newWidth);
                        }
                        
                    };
                    
                testSubject.insertAfter(input);
                
                $(this).bind('keyup keydown blur update', check);
                
            });
            
            return this;
        
        };
        
    })(jQuery);
    
/*
 * jQuery UI Multicolumn Autocomplete Widget Plugin 1.0
 * Copyright (c) 2012 Mark Harmon
 *
 * Depends:
 *   - jQuery UI Autocomplete widget
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
*/
$.widget('custom.mcautocomplete', $.ui.autocomplete, {
    _renderMenu: function(ul, items) {
        var self = this,
            thead;

        if (this.options.showHeader) {
            table = $('<div class="ui-widget-header" style="width:100%"></div>');
            $.each(this.options.columns, function(index, item) {
                table.append('<span style="padding:0 4px;float:left;width:' + item.width + ';">' + item.name + '</span>');
            });
            table.append('<div style="clear: both;"></div>');
            ul.append(table);
        }
        $.each(items, function(index, item) {
            self._renderItem(ul, item);
        });
    },
    _renderItem: function(ul, item) {
        var t = '',
        result = '';

        $.each(this.options.columns, function(index, column) {
            t += '<span style="padding:0 4px;float:left;width:' + column.width + ';">' + item[column.valueField ? column.valueField : index] + '</span>'
        });

        result = $('<li></li>').data('item.autocomplete', item).append('<a class="mcacAnchor">' + t + '<div style="clear: both;"></div></a>').appendTo(ul);
        return result;
    }
});

// Autosize 1.11 - jQuery plugin for textareas
// (c) 2012 Jack Moore - jacklmoore.com
// license: www.opensource.org/licenses/mit-license.php

(function ($) {
    var
    hidden = 'hidden',
    borderBox = 'border-box',
    lineHeight = 'lineHeight',
    copy = '<textarea tabindex="-1" style="position:absolute; top:-9999px; left:-9999px; right:auto; bottom:auto; -moz-box-sizing:content-box; -webkit-box-sizing:content-box; box-sizing:content-box; word-wrap:break-word; height:0 !important; min-height:0 !important; overflow:hidden;">',
    // line-height is omitted because IE7/IE8 doesn't return the correct value.
    copyStyle = [
        'fontFamily',
        'fontSize',
        'fontWeight',
        'fontStyle',
        'letterSpacing',
        'textTransform',
        'wordSpacing',
        'textIndent'
    ],
    oninput = 'oninput',
    onpropertychange = 'onpropertychange',
    test = $(copy)[0];

    // For testing support in old FireFox
    test.setAttribute(oninput, "return");

    if ($.isFunction(test[oninput]) || onpropertychange in test) {

        // test that line-height can be accurately copied to avoid
        // incorrect value reporting in old IE and old Opera
        $(test).css(lineHeight, '99px');
        if ($(test).css(lineHeight) === '99px') {
            copyStyle.push(lineHeight);
        }

        $.fn.autosize = function (className) {
            return this.each(function () {
                var
                ta = this,
                $ta = $(ta),
                mirror,
                minHeight = $ta.height(),
                maxHeight = parseInt($ta.css('maxHeight'), 10),
                active,
                i = copyStyle.length,
                resize,
                boxOffset = 0;

                if ($ta.css('box-sizing') === borderBox || $ta.css('-moz-box-sizing') === borderBox || $ta.css('-webkit-box-sizing') === borderBox){
                    boxOffset = $ta.outerHeight() - $ta.height();
                }

                if ($ta.data('mirror') || $ta.data('ismirror')) {
                    // if autosize has already been applied, exit.
                    // if autosize is being applied to a mirror element, exit.
                    return;
                } else {
                    mirror = $(copy).data('ismirror', true).addClass(className || 'autosizejs')[0];

                    resize = $ta.css('resize') === 'none' ? 'none' : 'horizontal';

                    $ta.data('mirror', $(mirror)).css({
                        overflow: hidden,
                        overflowY: hidden,
                        wordWrap: 'break-word',
                        resize: resize
                    });
                }

                // Opera returns '-1px' when max-height is set to 'none'.
                maxHeight = maxHeight && maxHeight > 0 ? maxHeight : 9e4;

                // Using mainly bare JS in this function because it is going
                // to fire very often while typing, and needs to very efficient.
                function adjust() {
                    var height, overflow;
                    // the active flag keeps IE from tripping all over itself.  Otherwise
                    // actions in the adjust function will cause IE to call adjust again.
                    if (!active) {
                        active = true;

                        mirror.value = ta.value;

                        mirror.style.overflowY = ta.style.overflowY;

                        // Update the width in case the original textarea width has changed
                        mirror.style.width = $ta.css('width');

                        // Needed for IE to reliably return the correct scrollHeight
                        mirror.scrollTop = 0;

                        // Set a very high value for scrollTop to be sure the
                        // mirror is scrolled all the way to the bottom.
                        mirror.scrollTop = 9e4;

                        height = mirror.scrollTop;
                        overflow = hidden;
                        if (height > maxHeight) {
                            height = maxHeight;
                            overflow = 'scroll';
                        } else if (height < minHeight) {
                            height = minHeight;
                        }
                        ta.style.overflowY = overflow;

                        ta.style.height = height + boxOffset + 'px';
                        
                        // This small timeout gives IE a chance to draw it's scrollbar
                        // before adjust can be run again (prevents an infinite loop).
                        setTimeout(function () {
                            active = false;
                        }, 1);
                    }
                }

                // mirror is a duplicate textarea located off-screen that
                // is automatically updated to contain the same text as the
                // original textarea.  mirror always has a height of 0.
                // This gives a cross-browser supported way getting the actual
                // height of the text, through the scrollTop property.
                while (i--) {
                    mirror.style[copyStyle[i]] = $ta.css(copyStyle[i]);
                }

                $('body').append(mirror);

                if (onpropertychange in ta) {
                    if (oninput in ta) {
                        // Detects IE9.  IE9 does not fire onpropertychange or oninput for deletions,
                        // so binding to onkeyup to catch most of those occassions.  There is no way that I
                        // know of to detect something like 'cut' in IE9.
                        ta[oninput] = ta.onkeyup = adjust;
                    } else {
                        // IE7 / IE8
                        ta[onpropertychange] = adjust;
                    }
                } else {
                    // Modern Browsers
                    ta[oninput] = adjust;
                }

                $(window).resize(adjust);

                // Allow for manual triggering if needed.
                $ta.bind('autosize', adjust);

                // Hack to get Chrome to reflow it's text.
                $ta.text($ta.text());

                // Call adjust in case the textarea already contains text.
                adjust();
            });
        };
    } else {
        // Makes no changes for older browsers (FireFox3- and Safari4-)
        $.fn.autosize = function () {
            return this;
        };
    }

}(jQuery));