/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, RequestHandler, Response } from 'express';
import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import axios from 'axios';
import express from 'express';
import dotenv from 'dotenv';
import Redis from 'ioredis';

dotenv.config();
const app = express();
app.use(express.json());
//const X_API_KEY = process.env.X_API_KEY;
//const baseUrl = process.env.API_BASE_URL;
const redis = new Redis();
const X_API_KEY = 'xafUwAhXn04uyZV2h1IBT7NmmOabq6ys2hzKcqY9';
const baseUrl = 'https://horoscope-feeds.ganeshaspeaks.com/horoscope/';

class IndexController {
  static gethoroscope: RequestHandler<{}, any, any, Record<string, any>>;
  static getpanchang(_arg0: string, _getpanchang: any) {
    throw new Error('Method not implemented.');
  }
  // public index = (req: Request, res: Response, next: NextFunction): void => {
  //   try {
  //     res.sendStatus(200);
  //   } catch (error) {
  //     next(error);
  //   }
  // };
  gethoroscope = async (req: Request, res: Response): Promise<any> => {
    // frequency should be => weekly, daily, monthly, yearly
    // NEED TO CHECK WITH CLIENT, that do we need to make frequency madatory or not
    // if not , what will be default value.
    const frequency = req.query.frequency || 'weekly';

    // will return all the sunsign values.
    const sunsign = req.query.sunsign;

    // making eng as default languaage.
    const lang = req.query.lang || 'eng';

    let url = `${baseUrl}${frequency}-array?lang=${lang}`;
    //let url = `${baseUrl}${frequency}-array?lang=${lang}&${sunsign}`;

    if (sunsign) {
      url = url + '&sunsign=' + sunsign;
    }
    const key = await redis.get(`${lang}_${sunsign}_${frequency}`);
    console.log('key', key);

    if (key) {
      const val = JSON.parse(key);
      res.send(val);
    } else {
      //    console.log(url)

      const response: any = await axios
        .get(url, { headers: { 'x-api-key': X_API_KEY } })

        .catch(err => console.error(err));
      await redis.set(`${lang}_${sunsign}_${frequency}`, JSON.stringify(response.data));
      //res.send(_response.data);

      // if (_response.status == 500) {
      //   res.send(500).statusMessage("Something went wrong, please try again later");
      //   return;
      // }

      res.status(200).send(response.data);
    }
  };
  getpanchang = async (req: Request, res: Response): Promise<any> => {
    console.log(`hghh`);
    const lang = req.query.lang || 'eng';
    const urll = `${baseUrl}panchang?lang=${lang}`;
    const key = await redis.get(`${lang}`);
    console.log(key);
    if (key) {
      const val = JSON.parse(key);
      res.send(val);
      //   console.log(val)
    } else {
      const response: any = await axios.get(urll, { headers: { 'x-api-key': X_API_KEY } }).catch(err => console.error(err));

      //let responsee=JSON.parse(response)
      await redis.set(`${lang}`, JSON.stringify(response.data));
      //res.send(response.data);

      // if (response.status == 500) {
      //   res.send(500).statusMessage('Something went wrong, please try again later');
      //   return;
      // }

      res.status(200).send(response.data);
    }
  };
}
//}
export default IndexController;
