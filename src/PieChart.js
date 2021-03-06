import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image } from 'react-native';

import { Pie } from 'react-native-pathjs-charts';
import * as colors from './utils/colors';
import { emotions } from './utils/emotionList';
import { chart_const, style_const, granny_const } from './utils/constants';
import { hexToRgb, hexToRgbaStr } from './utils/utilFunctions';

const neutralImage = require('../assets/emotions/neutral.png');
const angerImage = require('../assets/emotions/anger.png');
const contemptImage = require('../assets/emotions/contempt.png');
const disgustImage = require('../assets/emotions/disgust.png');
const fearImage = require('../assets/emotions/fear.png');
const happyImage = require('../assets/emotions/happy.png');
const sadImage = require('../assets/emotions/sad.png');
const surprisedImage = require('../assets/emotions/surprised.png');

const emotionImages = {
  neutral: neutralImage,
  anger: angerImage,
  contempt: contemptImage,
  disgust: disgustImage,
  fear: fearImage,
  happiness: happyImage,
  sadness: sadImage,
  surprise: surprisedImage,
};

const CHART_CENTER_SIZE = chart_const.chart_options.pie.r * 2 - chart_const.INNER_CIRCLE_MARGIN * 2;

const styles = StyleSheet.create({
  container: {
    height: chart_const.HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  chartContainer: {
    //flex: 2,
    alignItems: 'center',
    margin: 10,
  },
  chartCenter: {
    position: 'absolute',
    width: CHART_CENTER_SIZE,
    height: CHART_CENTER_SIZE,
    borderRadius: (chart_const.chart_options.pie.r * 2 - chart_const.INNER_CIRCLE_MARGIN * 2) / 2,
    top: chart_const.RING_THICKNESS + chart_const.INNER_CIRCLE_MARGIN,
    left: chart_const.RING_THICKNESS + chart_const.INNER_CIRCLE_MARGIN,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartCenterImage: {
    width: CHART_CENTER_SIZE - 30,
    height: (CHART_CENTER_SIZE - 30) * granny_const.HEIGHT / granny_const.WIDTH,
  },
  legendsContainer: {
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  legendCellContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emotionCell: {

  },
  emotionTextContainer: {
    alignItems: 'center',
  },
  emotionScoreText: {
    fontSize: 20,
  },
  emotionNameText: {
    fontSize: 12,
  },
});

export default class PieChart extends Component {
  constructor(props) {
    super(props);
    const data = props.data.slice().sort((a, b) => emotions.indexOf(a.name) - emotions.indexOf(b.name));

    const pallete = emotions.map((emotion) => {
      const color = colors[emotion];
      return hexToRgb(color);
    });

    const emotionSum = props.data.reduce((prev, item) => prev + item.score, 0);

    const topThree = props.data.slice().sort((a, b) => {
      return ((b.score - a.score) === 0) 
          ? (emotions.indexOf(b.name) - emotions.indexOf(a.name)) // break tie by prioritizing pos emotions 
         : (b.score - a.score);
    }).slice(0, 3).map((item) => {
      const noremalizedScore = item.score / emotionSum;
      console.log('normalized', noremalizedScore);
      return {
        key: item.name,
        name: item.name[0].toUpperCase() + item.name.slice(1), 
        score: parseInt(noremalizedScore * 100), 
        color: colors[item.name],
        size: (noremalizedScore >= 0.4) ? 40 : 40 * (noremalizedScore * 100 / 40),
        borderRadius: (noremalizedScore >= 0.4) ? 4 : 4 * (noremalizedScore * 100 / 40),
      };
    });

    this.state = {
      data,
      pallete,
      topThree,
    };
  }

  render() {
    const { data, pallete, topThree } = this.state;
    const chartCenterBGColor = hexToRgbaStr(colors[topThree[0].key], 0.6);
    return (
      <View style={styles.container}>
        <View style={styles.chartContainer}>
          <Pie data={data}
            accessorKey='score'
            options={chart_const.chart_options.pie}
            pallete={pallete}
          />
          <View style={[styles.chartCenter, {backgroundColor: chartCenterBGColor}]}>
            <Image style={styles.chartCenterImage} source={emotionImages[topThree[0].key]} />
          </View>
        </View>
        <View style={styles.legendsContainer}>
        {
          topThree.map((item, i) => {
            return (
              <View style={styles.legendCellContainer} key={i}>
                <View style={[styles.emotionCell, {backgroundColor: item.color, width: item.size, height: item.size, borderRadius: item.borderRadius}]}></View>
                <View style={styles.emotionTextContainer}>
                  <Text style={styles.emotionScoreText}>{ item.score } %</Text>
                  <Text style={styles.emotionNameText}>{ item.name }</Text>
                </View>
              </View>
            );
          })
        }
        </View>
      </View>
    )
  }
}
