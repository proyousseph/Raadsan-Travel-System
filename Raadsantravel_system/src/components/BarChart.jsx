import React, { PureComponent } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default class Example extends PureComponent {
  static demoUrl = "https://codesandbox.io/s/simple-bar-chart-tpz8r";

  render() {
    const { last_10SalesRevenue } = this.props;

    if(last_10SalesRevenue.length ==0)
      return null
    const data = [
      {
        name: last_10SalesRevenue[0].day_date.split('-')[1] + '-' + last_10SalesRevenue[0].day_date.split('-')[2],
        Price: last_10SalesRevenue[0].Price,
      },
      {
        name: last_10SalesRevenue[1].day_date.split('-')[1] + '-' + last_10SalesRevenue[1].day_date.split('-')[2],
        Price: last_10SalesRevenue[1].Price,
      },
      {
        name: last_10SalesRevenue[2].day_date.split('-')[1] + '-' + last_10SalesRevenue[2].day_date.split('-')[2],
        Price: last_10SalesRevenue[2].Price,
      },
      {
        name: last_10SalesRevenue[3].day_date.split('-')[1] + '-' + last_10SalesRevenue[3].day_date.split('-')[2],
        Price: last_10SalesRevenue[3].Price,
      },
      {
        name: last_10SalesRevenue[4].day_date.split('-')[1] + '-' + last_10SalesRevenue[4].day_date.split('-')[2],
        Price: last_10SalesRevenue[4].Price,
      },
      {
        name: last_10SalesRevenue[5].day_date.split('-')[1] + '-' + last_10SalesRevenue[5].day_date.split('-')[2],
        Price: last_10SalesRevenue[5].Price,
      },
      {
        name: last_10SalesRevenue[6].day_date.split('-')[1] + '-' + last_10SalesRevenue[6].day_date.split('-')[2],
        Price: last_10SalesRevenue[6].Price,
      },
      {
        name: last_10SalesRevenue[7].day_date.split('-')[1] + '-' + last_10SalesRevenue[7].day_date.split('-')[2],
        Price: last_10SalesRevenue[7].Price,
      },
      {
        name: last_10SalesRevenue[8].day_date.split('-')[1] + '-' + last_10SalesRevenue[8].day_date.split('-')[2],
        Price: last_10SalesRevenue[8].Price,
      },
      {
        name: last_10SalesRevenue[9].day_date.split('-')[1] + '-' + last_10SalesRevenue[9].day_date.split('-')[2],
        Price: last_10SalesRevenue[9].Price,
      },
    ];
    const maxSales = Math.max(...data.map((item) => item.Price));
  const yDomain = [0, Math.ceil(maxSales / 1000) * 1000];

    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={yDomain}  />
          <Tooltip />
          <Legend />
          <Bar dataKey="Price" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}
