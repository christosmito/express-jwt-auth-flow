const expect = require("chai").expect;
const request = require("supertest");
const mongoose = require("mongoose");
const server = require("../server");

const index = require("../index");

describe("Test the index functionality", function() {
    describe("Test the signup functionality", function() {
        describe("Signs up successfully the user and then it deletes it from DB", function() {
            it("should signup the user", function(done) {
                request(index)
                .post("/users/signup")
                .send({
                        email: "testingauth123@testauth.com",
                        userName: "testingauth",
                        password: "12345678901",
                        confirmPassword: "12345678901"
                })
                .expect(201)
                .end(function(error, res) {
                    if(error) {
                        console.log(error);
                        done(error);
                    }
                    expect(res.body.status).to.be.equal("Success");
                    expect(res.body.token).to.be.exist;
                    done();
                })
            });

            it("should send an error for not sending email", function(done) {
                request(index)
                .post("/users/signup")
                .send({
                        // email: "testingauth123@testauth.com",
                        userName: "testingauth",
                        password: "12345678901",
                        confirmPassword: "12345678901"
                })
                .expect(400)
                .end(function(error, res) {
                    if(error) {
                        console.log(error);
                        done(error);
                    }
                    expect(res.body.status).to.be.equal("Fail");
                    expect(res.body.message).to.be.equal("Email is required");
                    done();
                })
            });

            it("should send an error for not sending username", function(done) {
                request(index)
                .post("/users/signup")
                .send({
                        email: "testingauth123@testauth.com",
                        // userName: "testingauth",
                        password: "12345678901",
                        confirmPassword: "12345678901"
                })
                .expect(400)
                .end(function(error, res) {
                    if(error) {
                        console.log(error);
                        done(error);
                    }
                    expect(res.body.status).to.be.equal("Fail");
                    expect(res.body.message).to.be.equal("username is required");
                    done();
                })
            });

            it("should send an error for not sending password", function(done) {
                request(index)
                .post("/users/signup")
                .send({
                        email: "testingauth123@testauth.com",
                        userName: "testingauth",
                        // password: "12345678901",
                        confirmPassword: "12345678901"
                })
                .expect(400)
                .end(function(error, res) {
                    if(error) {
                        console.log(error);
                        done(error);
                    }
                    expect(res.body.status).to.be.equal("Fail");
                    expect(res.body.message).to.be.equal("Password is required");
                    done();
                })
            });

            it("should send an error for not sending confirmation password", function(done) {
                request(index)
                .post("/users/signup")
                .send({
                        email: "testingauth123@testauth.com",
                        userName: "testingauth",
                        password: "12345678901"
                        // confirmPassword: "12345678901"
                })
                .expect(400)
                .end(function(error, res) {
                    if(error) {
                        console.log(error);
                        done(error);
                    }
                    expect(res.body.status).to.be.equal("Fail");
                    expect(res.body.message).to.be.equal("Password confirmation is required");
                    done();
                })
            });

            it("should send an error for not matching the passwords", function(done) {
                request(index)
                .post("/users/signup")
                .send({
                        email: "testingauth123@testauth.com",
                        userName: "testingauth",
                        password: "12345678901",
                        confirmPassword: "123456789010"
                })
                .expect(400)
                .end(function(error, res) {
                    if(error) {
                        console.log(error);
                        done(error);
                    }
                    expect(res.body.status).to.be.equal("Fail");
                    expect(res.body.message).to.be.equal("The passwords do not match");
                    done();
                })
            });
        })
    });

    describe("Test the login functionality", function() {
        it("should log in the user", function(done) {
            request(index)
            .post("/users/login")
            .send({
                email: "testingauth123@testauth.com",
                password: "12345678901"
            })
            .expect(200)
            .end(function(error, res) {
                if (error) {
                    console.log(error);
                    done(error);
                }
                expect(res.body.status).to.be.equal("Success");
                expect(res.body.token).to.be.exist;
                done();
            });
        });

        it("should send an error for not sending the email or password", function(done) {
            request(index)
            .post("/users/login")
            .send({
                // email: "testauth@testauth.com",
                password: "12345678901"
            })
            .expect(400)
            .end(function(error, res) {
                if (error) {
                    console.log(error);
                    done(error);
                }
                expect(res.body.status).to.be.equal("Fail");
                expect(res.body.message).to.be.equal("Please provide email and password");
                done();
            });
        });

        it("should send an error for not sending the email or password", function(done) {
            request(index)
            .post("/users/login")
            .send({
                email: "testingauth123@testauth.com"
                // password: "12345678901"
            })
            .expect(400)
            .end(function(error, res) {
                if (error) {
                    console.log(error);
                    done(error);
                }
                expect(res.body.status).to.be.equal("Fail");
                expect(res.body.message).to.be.equal("Please provide email and password");
                done();
            });
        });

        it("should send an error for not sending correct email", function(done) {
            request(index)
            .post("/users/login")
            .send({
                email: "testingauth1@testauth.com",
                password: "12345678901"
            })
            .expect(401)
            .end(function(error, res) {
                if (error) {
                    console.log(error);
                    done(error);
                }
                expect(res.body.status).to.be.equal("Fail");
                expect(res.body.message).to.be.equal("Incorrect email");
                done();
            });
        });

        it("should send an error for not sending correct password", function(done) {
            request(index)
            .post("/users/login")
            .send({
                email: "testingauth123@testauth.com",
                password: "123456789011"
            })
            .expect(401)
            .end(function(error, res) {
                if (error) {
                    console.log(error);
                    done(error);
                }
                expect(res.body.status).to.be.equal("Fail");
                expect(res.body.message).to.be.equal("Incorrect password");
                done();
            });
        });

    });

    describe("Test the update password functionality", function() {
        it("should update the user's password", function(done) {
            request(index)
            .post("/users/update-password")
            .send({
                email: "testingauth123@testauth.com",
                password: "12345678901",
                newPassword: "1234567890155555",
                confirmNewPassword: "1234567890155555"
            })
            .expect(200)
            .end(function(error, res) {
                if(error) {
                    console.log(error);
                    done(error);
                }
                expect(res.body.status).to.be.equal("Success");
                expect(res.body.message).to.be.equal("Your password was successfully changed");
                done();
            });
        });

        it("should send an error for not sending email", function(done) {
            request(index)
            .post("/users/update-password")
            .send({
                // email: "testingauth123@testauth.com",
                password: "12345678901",
                newPassword: "1234567890155555",
                confirmNewPassword: "1234567890155555"
            })
            .expect(400)
            .end(function(error, res) {
                if (error) {
                    console.log(error);
                    done(error);
                }
                expect(res.body.status).to.be.equal("Fail");
                expect(res.body.message).to.be.equal("Email is required");
                done();
            });
        });

        it("should send an error for not sending current password", function(done) {
            request(index)
            .post("/users/update-password")
            .send({
                email: "testingauth123@testauth.com",
                // password: "12345678901",
                newPassword: "1234567890155555",
                confirmNewPassword: "1234567890155555"
            })
            .expect(400)
            .end(function(error, res) {
                if (error) {
                    console.log(error);
                    done(error);
                }
                expect(res.body.status).to.be.equal("Fail");
                expect(res.body.message).to.be.equal("Your current password is required");
                done();
            });
        });

        it("should send an error for not sending new password", function(done) {
            request(index)
            .post("/users/update-password")
            .send({
                email: "testingauth123@testauth.com",
                password: "12345678901",
                // newPassword: "1234567890155555",
                confirmNewPassword: "1234567890155555"
            })
            .expect(400)
            .end(function(error, res) {
                if (error) {
                    console.log(error);
                    done(error);
                }
                expect(res.body.status).to.be.equal("Fail");
                expect(res.body.message).to.be.equal("New password is required");
                done();
            });
        });

        it("should send an error for not sending confirmation password", function(done) {
            request(index)
            .post("/users/update-password")
            .send({
                email: "testingauth123@testauth.com",
                password: "12345678901",
                newPassword: "1234567890155555"
                // confirmNewPassword: "1234567890155555"
            })
            .expect(400)
            .end(function(error, res) {
                if (error) {
                    console.log(error);
                    done(error);
                }
                expect(res.body.status).to.be.equal("Fail");
                expect(res.body.message).to.be.equal("Password confirmation is required");
                done();
            });
        });
    });

    describe("Test forgot password functionality", function() {
        it("should send an email to the user with reset token link", function(done) {
            request(index)
            .post("/users/forgot-password")
            .send({
                email: "testingauth123@testauth.com"
            })
            .expect(200)
            .end(function(error, res) {
                if(error) {
                    console.log(error);
                    done(error);
                }
                expect(res.body.status).to.be.equal("Success");
                done();
            })
        });

        it("should send an error for not sending email", function(done) {
            request(index)
            .post("/users/forgot-password")
            .send({
                // email: "testingauth123@testauth.com"
            })
            .expect(400)
            .end(function(error, res) {
                if(error) {
                    console.log(error);
                    done(error);
                }
                expect(res.body.status).to.be.equal("Fail");
                expect(res.body.message).to.be.equal("Please provide an email");
                done();
            })
        });
    });

    xdescribe("Test reset password functionality", function() {
        it("should send an error for not sending password", function(done) {
            request(index)
            .post("/users/reset-password/12345")
            .send({
                // password: "123456789"
                confirmPassword: "123456789"
            })
            .expect(400)
            .end(function(error, res) {
                if(error) {
                    console.log(error);
                    done(error);
                }
                expect(res.body.status).to.be.equal("Fail");
                expect(res.body.message).to.be.equal("Please provide password and confirmation password");
                done();
            })
        });

        it("should send an error for not sending confirm password", function(done) {
            request(index)
            .post("/users/reset-password/12345")
            .send({
                password: "123456789"
                // confirmPassword: "123456789"
            })
            .expect(400)
            .end(function(error, res) {
                if(error) {
                    console.log(error);
                    done(error);
                }
                expect(res.body.status).to.be.equal("Fail");
                expect(res.body.message).to.be.equal("Please provide password and confirmation password");
                done();
            })
        });

        it("should send an error for not matching the passwords", function(done) {
            request(index)
            .post("users/resert-passwords/12345")
            .send({
                password: "1234567890",
                confirmPassword: "123456789"
            })
            .expect(400)
            .end(function(error, res) {
                if(error) {
                    console.log(error);
                    done(error);
                }
                expect(res.body.status).to.be.equal("Fail");
                expect(res.body.message).to.be.equal("The passwords do not match");
            });
        })
    });

    after(function() {
        mongoose.connection.close(function() {
            console.log("The connection with DB was closed");
        });
        server.close(function() {
            console.log("The server was closed");
        });
      });
});

// mongoose.connection.db.dropCollection("users", function(error, result){
//     if (error) {
//         console.log("Error deleting the collection");
//         console.log(error);
//     }
//     console.log("The users collection was deleted")
// });
