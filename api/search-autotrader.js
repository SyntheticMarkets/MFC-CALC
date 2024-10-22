
import axios from 'axios';
import cheerio from 'cheerio';

export default async function handler(req, res) {
    const { query } = req.query;
    const searchQuery = query.replace(" ", "-").toLowerCase();
    const url = `https://www.autotrader.co.za/car-search?query=${searchQuery}`;

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        let vehicles = [];
        $('.vehicle-item').each((index, element) => {
            const title = $(element).find('.vehicle-title').text().trim();
            const price = $(element).find('.vehicle-price').text().trim();
            const link = $(element).find('a').attr('href');
            vehicles.push({ title, price, link });
        });
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({ error: 'Failed to scrape AutoTrader' });
    }
}
