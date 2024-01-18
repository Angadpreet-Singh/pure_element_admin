import { Users } from '../models'
import PasswordHashing from '../utlis/password-hashing'

export const userValidation = {
  first_name: {
    exists: {
      errorMessage: "First Name is required.",
    },
    isLength: {
      errorMessage: "First Name is required.",
      options: { min:1 },
    },
  },
  last_name: {
    exists: {
      errorMessage: "Last Name is required.",
    },
    isLength: {
      errorMessage: "Last Name is required.",
      options: { min:1 },
    },
  },
  email_address: {
    exists: {
      errorMessage: "Email is required.",
    },
    isEmail: {
      bail: true,
      errorMessage: "Email is not a valid email.",
    },
    custom: {
      options: (value, { req, location, path }) => {
        return Users.findOne({ where: {
          email_address: value,
          status: "Active",
        }}).then(user => {
          if (user) {
            return Promise.reject('E-mail already in use');
          }
        });
    }
  }
  },
  user_password: {
    exists: {
      errorMessage: "Password is required.",
    },
    isLength: {
      errorMessage: "Password should be at least 7 chars long",
      options: { min: 7 },
    },
  },
  
  phone_number: {
    exists: {
      errorMessage: "Phone Number is required.",
    },
    isInt: {
      errorMessage: "Phone Number is not a valid Phone Number",
    },
  },
  // status: {
  //   matches: {
  //     options: [/\b(?:Active|Inactive|Deleted)\b/],
  //     errorMessage: "Invalid Status"
  //   }
  // }
};

export const userLoginValidation = {
  email: {
    exists: {
      errorMessage: "Email is required.",
    },
    isEmail: {
      bail: true,
      errorMessage: "Email is not a valid email.",
    },
  },
  password: {
    exists: {
      errorMessage: "Password is required.",
    },
    // isLength: {
    //   errorMessage: "Password should be at least 7 chars long",
    //   options: { min: 7 },
    // },
  }
}

export const changeStatusValidation = {
  status: {
    isLength: {
      errorMessage: "First Name is required.",
      options: { min:1 },
    },
  }
}


export const otpValidation = {
  email: {
    isEmail: {
      bail: true,
      errorMessage: "Email is not a valid email."
    },
    custom: {
      options: (value, { req, location, path }) => {
        return Users.findOne({ where: {
          email_address: value,
          status: "Active",
        }}).then(user => {
          if (!user) {
            return Promise.reject('E-mail is not registerd');
          }
        });
    }
  }
}
}

export const verifyOtpValidation = {
  email: {
    isEmail: {
      bail: true,
      errorMessage: "Email is not a valid email."
    }
  },
  otp: {
    isInt: {
      errorMessage: "OTP is not Valid",
    }
  }
}


export const changePassword = {
  oldPassword: {
    custom: {
      options: (value, { req, location, path }) => {

        if(!value) return Promise.reject('Old Password is required');
        return Users.findOne({ where: {
          id: req.user.id
        }}).then( async user => {

          const checked = await PasswordHashing.comparePassword(
            value,
            user.user_password);
            console.log("checked",checked)
          if (!checked) {
            return Promise.reject('Old Password is Incorrect');
          }
        });
    }
  }
  },
  newPassword: {
    isLength: {
      errorMessage: "Password should be at least 7 chars long",
      options: { min:7 },
    },
  }
}

export const forgetPassword = {
  otp: {
    isInt: {
      errorMessage: "OTP is not Valid",
    }
  },
  newPassword: {
    isLength: {
      errorMessage: "Password should be at least 7 chars long",
      options: { min:7 },
    }
  }
}
