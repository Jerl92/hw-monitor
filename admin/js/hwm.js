/**
 * hwm.js
 * @fileoverview Javascript for HW Monitor
 * @author PRESSMAN
 * @version 1.0.0
 * @license http://www.gnu.org/licenses/old-licenses/gpl-2.0.html GNU General Public License, v2 or higher
 */
! function($) {
    var adminAjaxUrl = $('#admin-ajax-url').val(),
        graphs = {};

    function getData() {
        if (document.hidden) {
            // Stop when background.
            return;
        }

        $.ajax({
            url: adminAjaxUrl,
            type: 'post',
            data: { 'action': 'hwm' }
        }).done(function(data) {
            $('#test').text(JSON.stringify(data));
            var len = data.length;

            for (var i = 0; i < len; i++) {
                var d = data[i];

                if (!$('#' + d.id)[0]) {
                    var $hwmArea = $('#hwm-area'),
                        areaHtml = '' +
                        '<div id="' + d.id + '">' +
                        '  <div id="' + d.id + '-title" class="title">' +
                        '    <h1>' + d.name + '</h1>' +
                        '    <div class="sub" title="' + d.summary + '">' + d.summary + '</div>' +
                        '  </div>' +
                        '  <small>' + $('#sec').val() + '</small>' +
                        '  <div id="' + d.id + '-graph" class="graph"></div>' +
                        '  <div id="' + d.id + '-desc" class="desc"></div>' +
                        '  <div id="' + d.id + '-error" class="hwm-error"></div>' +
                        '</div>';

                    if ($hwmArea.children('div').length && !($hwmArea.children('div').length % 2)) {
                        $hwmArea.append('<hr>');
                    }

                    $hwmArea.append($(areaHtml));

                    graphs[d.id] = c3.generate({
                        bindto: '#' + d.id + '-graph',
                        data: {
                            columns: [
                                ['data0'].concat(Array(25).fill(null))
                            ],
                            names: { data0: d.name },
                            types: { data0: 'area' }
                        },
                        axis: { x: { show: false }, y: { min: 0, max: d.max, padding: { top: 0, bottom: 0 } } },
                        grid: { x: { show: true }, y: { show: true } },
                        point: { r: 0 },
                        color: { pattern: [d.color] },
                        legend: { show: false },
                        tooltip: {
                            format: {
                                title: function(d) {
                                    return '';
                                }
                            }
                        }
                    });
                }

                graphs[d.id].flow({
                    columns: [
                        ['data0'].concat([d.rate])
                    ]
                });
                var $desc = $('#' + d.id + '-desc');
                $desc.empty();

                for (var j in d.desc) {
                    $desc.append('' +
                        '<div>' +
                        '  <h5>' + j + '</h5>' +
                        '  <div>' + d.desc[j] + '</div>' +
                        '</div>');
                }

                var $error = $('#' + d.id + '-error');
                $error.empty();

                for (var j in d.error) {
                    $error.append('<div>' + d.error[j].message + '</div>');
                }
            }
        });
    }

    $(function() {
        getData();
        setInterval(getData, parseInt($('#interval').val(), 10) * 1000);
    });
}(jQuery);