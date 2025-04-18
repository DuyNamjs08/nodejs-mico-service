const Calculation = require('../entity/Calculation');
const { getRepository } = require('typeorm');

const calController = async (req, res) => {
  try {
    const { number, result } = req.body;

    if (number === undefined || result === undefined) {
      return res
        .status(400)
        .json({ message: 'number and result are required' });
    }
    const calculationRepo = getRepository('Calculation');

    const newCalculation = calculationRepo.create({
      number,
      result,
    });

    const savedCalculation = await calculationRepo.save(newCalculation);

    res.status(201).json(savedCalculation);
  } catch (err) {
    console.error('Error creating calculation:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  calController,
};
