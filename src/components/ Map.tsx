import { useLayoutEffect } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import worldHigh from '@amcharts/amcharts5-geodata/worldHigh';
import animated from '@amcharts/amcharts5/themes/Animated';

export const Map = ({ format }: { format: 'orthographic' | 'mercator' }) => {
	useLayoutEffect(() => {
		const root = am5.Root.new('chartdiv');

		if (root._logo) {
			root._logo.dispose();
		}

		const tailwindTheme = am5.Theme.new(root);

		tailwindTheme.rule('Label').setAll({
			fontFamily:
				'var( --default-font-family, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" )',
			fontSize: '1.5em',
		});

		root.setThemes([animated.new(root)]);

		let chart: am5map.MapChart;

		if (format === 'orthographic') {
			chart = root.container.children.push(
				am5map.MapChart.new(root, {
					panX: 'rotateX',
					panY: 'rotateY',
					projection: am5map.geoOrthographic(),
				})
			);
		} else if (format === 'mercator') {
			chart = root.container.children.push(
				am5map.MapChart.new(root, {
					panX: 'translateX',
					panY: 'translateY',
					projection: am5map.geoMercator(),
				})
			);
		} else {
			throw new Error('Invalid format');
		}

		const polygonSeries = chart.series.push(
			am5map.MapPolygonSeries.new(root, {
				geoJSON: {
					...worldHigh,
				},
				exclude: ['AQ'],
			})
		);

		polygonSeries.mapPolygons.template.setAll({
			tooltipText: '{name}',
			toggleKey: 'active',
			interactive: true,
		});

		polygonSeries.mapPolygons.template.states.create('hover', {
			fill: am5.color(0x000000),
		});

		polygonSeries.mapPolygons.template.states.create('active', {
			fill: am5.color(0x000000),
		});

		let previousPolygon: am5map.MapPolygon | undefined;

		polygonSeries.mapPolygons.template.on('active', (_active, target) => {
			if (previousPolygon && previousPolygon != target) {
				previousPolygon.set('active', false);
			}
			if (target?.get('active')) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				polygonSeries.zoomToDataItem(target.dataItem);
				polygonSeries.mapPolygons.each((polygon) => {
					if (polygon != target) {
						polygon.states.applyAnimate('inactive');
					}
				});
			} else {
				chart.goHome();
			}
			previousPolygon = target;
		});

		const zoomControl = chart.set(
			'zoomControl',
			am5map.ZoomControl.new(root, {})
		);

		zoomControl.homeButton.set('visible', true);

		zoomControl.homeButton.events.on('click', () => {
			chart.goHome();
			polygonSeries.mapPolygons.each((polygon) => {
				polygon.states.applyAnimate('default');
			});
		});

		chart.chartContainer.get('background')?.events.on('click', () => {
			chart.goHome();
			polygonSeries.mapPolygons.each((polygon) => {
				polygon.states.applyAnimate('default');
			});
		});

		return () => {
			root.dispose();
		};
	});

	return <div id="chartdiv" style={{ width: '100%', height: '500px' }}></div>;
};
