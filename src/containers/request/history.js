import React from 'react';
import {
  convertIsSmoking,
  convertSmokingYear,
  convertDrinkingAlcohol,
  convertFamilyDisease,
} from '../../utils';

const ListItem = ({ title, body, style }) => (
  <li className="clearfix" style={style}>
    <span>{title}</span>
    <strong>{body}</strong>
  </li>
);

export default ({ medical }) => (
  <div>
    <ul className="list-info">
      <ListItem title="Blood" body={medical.bloodType || 'N/A'} />
      <ListItem title="Height" body={medical.userHeight || 'N/A'} />
      <ListItem title="Weight" body={medical.userWeight || 'N/A'} />
      <ListItem title="Smoking" body={convertIsSmoking(medical.isSmoking)} />
      <ListItem
        title="Smoking for"
        body={convertSmokingYear(medical.smokingYear)}
      />
      <ListItem
        title="Drinking"
        body={convertDrinkingAlcohol(medical.drinkingAlcohol)}
      />
      <ListItem
        title="Family has cancer"
        body={convertFamilyDisease(medical.familyCancer)}
      />
      <ListItem title="Cancer Type" body={medical.familyCancerType || 'N/A'} />
      <ListItem
        title="Family has high blood"
        body={convertFamilyDisease(medical.familyHighBlood)}
      />
      <ListItem
        title="Family has high Cholesterol"
        body={convertFamilyDisease(medical.familyHighCholesterol)}
      />
      <ListItem
        title="Family has diabetes"
        body={convertFamilyDisease(medical.familyDiabetes)}
      />
    </ul>
  </div>
);