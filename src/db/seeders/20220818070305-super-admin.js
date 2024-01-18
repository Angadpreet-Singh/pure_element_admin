'use strict';
import PasswordHashing from '../../utlis/password-hashing'

async function hashedPassword(){
    let hash = await PasswordHashing.hash('123456789');
    return hash
}


module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        user_id: 'SA0001',
        first_name: 'Super',
        last_name: 'Admin',
        email_address: 'dev.spirehubs@gmail.com',
        email_varified: true,
        phone_number: 9876543210,
        phone_varified: true,
        user_password: await hashedPassword(),
        otp_code: null,
        token: null,
        last_login: null,
        user_role: 'Admin',
        user_type: 'Admin',
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
