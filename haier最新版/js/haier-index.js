/**
*	common javascript.
*	@Author Nlwy update 2015-07-12.
*	Copyright haier 2015.
*	@param str{String}
*/
$(document).ready(function() {                                                  
	Highcharts.setOptions({                                                     
	    global: {                                                               
	        useUTC: false                                                       
	    }                                                                       
	}); 
});
var currentTime = (new Date()).getTime();
var yMax = 0;
function getMax(maxValue) {
	if (maxValue % 100 == 0) {
		return maxValue;
	} else {
		console.log((maxValue / 100 + 1) * 100);
		return (parseInt(maxValue / 100) + 1) * 100;
	}
}
var chars = {
	show : function(){
        var chart;                                                                  
        $('#chart').highcharts({
        	credits: {
                 enabled: false
            },
            colors: ['#00c8e0', '#f00', '#00c8e0'],
            chart: {                                                                
                //type: 'spline',//平滑切换                                                     
                //animation: Highcharts.svg, // don't animate in old IE    
            	//width: 5000,
                events: {                                                           
                    load: function() {                                              
                                                                                    
                        // set up the updating of the chart each second             
                        var series = this.series[0];  
                        var series1 = this.series[1];
                        setInterval(function(){
                            //alert(series.data.length);
                        	callRpc(rpcUrl + routeStateIndex.paramOperate.businessRouterType + token, routeStateIndex.paramOperate.method.getTrafficInfo, null, function(data){
                        		//var currxrate = data.currxrate / 8;//实时接收速率(单位KB/s)
                        		//var curtxrate = data.curtxrate / 8;//实时发送速率(单位KB/s)
                        		var currxrate = Math.random() * 500;//实时接收速率(单位KB/s)
                        		var curtxrate = Math.random() * 500;//实时发送速率(单位KB/s)
                        		var x = (new Date()).getTime(); // current time
	                        	$('#up_curtxrate').text(currxrate.toFixed(2) + "KB/s");
	                        	$('#down_currxrate').text(curtxrate.toFixed(2) + "KB/s");
	                        	if (series.data.length > 10) {
	                        		series.removePoint(0);
	                        	}
	                        	if (series1.data.length > 10) {
	                        		series1.removePoint(0);
	                        	}
	                        	if (currxrate > yMax) {
	                        		yMax = currxrate;
	                        		series.yAxis.setExtremes(0, getMax(yMax));
	                        	}
	                        	if (curtxrate > yMax) {
	                        		yMax = curtxrate;
	                        		series.yAxis.setExtremes(0, getMax(yMax));
	                        	}
                        		series.addPoint([x, currxrate]);
                        		series1.addPoint([x, curtxrate]);
                        	});
                        }, 1000); 
                    }                                                               
                }                                                                   
            },                                                                      
            /**
        	 * 标题
        	 */
        	title: {                                                                
        	    text: ''                                            
        	},   
        	/**
        	 * x轴设置
        	 */
        	xAxis: {
        		gridLineWidth:1,
        	    type: 'datetime',                                                   
        	    tickPixelInterval: 100
        	},  
        	/**
        	 * y轴设置
        	 */
        	yAxis: {     
        		type: 'linear',
        	    title: {                                                            
        	        text: ''                                                   
        	    },                                                                  
        	    plotLines: [{                                                       
        	        value: 0,                                                       
        	        width: 1,                                                       
        	        color: '#00c8e0'                                                
        	    }],
        	    max: 100,
        	    min:0,
        	    tickInterval: 10,
        	    tickAmount: 10,
        	    labels: {
        	        formatter:function(){
        	            return this.value + (this.value > 1000 ? "MB/s" : "KB/s");
        	        }
        	      }
        	},                                                                      
            tooltip: {                                                              
                formatter: function() {                                             
                        return '<b>'+ this.series.name +'</b><br>'+                
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br>'+
                        Highcharts.numberFormat(this.y, 2);                         
                }                                                                   
            },                                                                      
            legend: {                                                               
                enabled: false                                                      
            },                                                                      
            exporting: {                                                            
                enabled: false                                                      
            },                                                                      
            series: [{                                                              
                name: '发送速率', 
                data: [{x:currentTime, y: 0}]
            } ,{                                                              
                name: '接收速率',
                data: [{x:currentTime, y: 0}]
            }]                                                                      
        });                                                                          
	}
}