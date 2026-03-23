from flask import jsonify                             # Use Flask to import Python Code as JSON
from flask_swagger_ui import get_swaggerui_blueprint  #Import swagger from Python Package.

swaggerAHFULDocsURL = '/APIDocs'                              # URL for exposing Swagger UI
configDocURL = '/APIDocs/swagger.json'   #URL for the Backend Configuration for the UI
appNameconfig={'app_name': "AHFUL Users API",'tagsSorter': 'alpha','operationsSorter': 'method'}                 #Header App Name to display in UI

swaggerUIBlueprint = get_swaggerui_blueprint(swaggerAHFULDocsURL, configDocURL, appNameconfig)

# ── GET Rotue to Return the Local Swagger API Config ────────────────────────────────────────────────────────────
@swaggerUIBlueprint.route('/swagger.json', methods=["GET"])
def swagger_json():
    return jsonify(swaggerConfig)

#All Local Swagger API Docs Config is setup here:
swaggerConfig = {
  "openapi": "3.0.3",
  "info": {
    "title": "AHFUL Users API",
    "version": "1.0.0"
  },
  "servers": [
    { "url": "/" }
  ],
  "paths": {

    "/AHFULusers/": {
      "get": {
        "summary": "Get all users",
        "tags": ["Users"],
        "responses": {
          "200": {
            "description": "A list of users",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": { "type": "object" }
                }
              }
            }
          },
          "500": {
            "description": "Server error",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULusers/{email}": {
      "get": {
        "summary": "Get user by email",
        "tags": ["Users"],
        "parameters": [
          {
            "name": "email",
            "in": "path",
            "required": True,
            "description": "Email address of the user",
            "schema": { "type": "string", "format": "email" }
          }
        ],
        "responses": {
          "200": {
            "description": "User found",
            
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "_id": { "type": "string", "example": "6993a3b2b684e1023202a5e9" },
                    "email": { "type": "string", "format": "email", "example": "jane@example.com" },
                    "name": { "type": "string", "example": "Jane Doe" },
                    "password": {
                      "type": "string",
                      "example": "scrypt:32768:8:1$Hp6N4Svxx8qtF6Eg$7b80288755977aeecb541720c2dd77a1d27b85aee23d905b7e4990f8f776d491082e928817269610897c77e82e2acc04fe2c04cd94dce3aebf5ff9ea44673319"
                    },
                    "role": { "type": "integer", "example": 0 }
                  },
                "required": ["_id", "email", "name", "password", "role"]
                }
              }
            }

          },
          "404": {
            "description": "User not found",
            "content": {
              "application/json": {
                "schema": { 
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULusers/id/{id}": {
      "get": {
        "summary": "Get user by id",
        "tags": ["Users"],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": True,
            "description": "User id of the user",
            "schema": { "type": "string"}
          }
        ],
        "responses": {
          "200": {
            "description": "User found",
            
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "_id": { "type": "string", "example": "6993a3b2b684e1023202a5e9" },
                    "email": { "type": "string", "format": "email", "example": "jane@example.com" },
                    "name": { "type": "string", "example": "Jane Doe" },
                    "password": {
                      "type": "string",
                      "example": "scrypt:32768:8:1$Hp6N4Svxx8qtF6Eg$7b80288755977aeecb541720c2dd77a1d27b85aee23d905b7e4990f8f776d491082e928817269610897c77e82e2acc04fe2c04cd94dce3aebf5ff9ea44673319"
                    },
                    "role": { "type": "integer", "example": 0 }
                  },
                "required": ["_id", "email", "name", "password", "role"]
                }
              }
            }

          },
          "404": {
            "description": "User not found",
            "content": {
              "application/json": {
                "schema": { 
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULusers/add/roll/id/": {
      "post": {
        "summary": "Add role to user by id",
        "tags": ["Users"],
        "requestBody": {
          "required": True,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "user_id": { "type": "string", "example": "6993a3b2b684e1023202a5e9" },
                  "adder_id": { "type": "string", "example": "6993a3b2b684e1023202a5e9" },
                  "role": { "type": "string", "example": "Admin" }
                },
                "required": ["user_id", "adder_id", "role"]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Role added; updated user returned",
            "content": {
              "application/json": {
                "schema": { "type": "object" }
              }
            }
          },
          "404": {
            "description": "User not found or validation error",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string", "example": "Adder does not have permission" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULusers/add/roll/email/": {
      "post": {
        "summary": "Add role to user by email",
        "tags": ["Users"],
        "requestBody": {
          "required": True,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "user_email": { "type": "string", "format": "email", "example": "jane@example.com" },
                  "adder_id": { "type": "string", "example": "6993a3b2b684e1023202a5e9" },
                  "role": { "type": "string", "example": "Gym Owner" }
                },
                "required": ["user_email", "adder_id", "role"]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Role added; updated user returned",
            "content": {
              "application/json": {
                "schema": { "type": "object" }
              }
            }
          },
          "404": {
            "description": "User not found or validation error",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string", "example": "Provided role is unidentified" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULusers/remove/roll/id/": {
      "post": {
        "summary": "Remove role from user by id",
        "tags": ["Users"],
        "requestBody": {
          "required": True,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "user_id": { "type": "string", "example": "6993a3b2b684e1023202a5e9" },
                  "remover_id": { "type": "string", "example": "6993a3b2b684e1023202a5e9" },
                  "role": { "type": "string", "example": "Admin" }
                },
                "required": ["user_id", "remover_id", "role"]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Role removed; updated user returned",
            "content": {
              "application/json": {
                "schema": { "type": "object" }
              }
            }
          },
          "404": {
            "description": "User not found or validation error",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string", "example": "Remover does not have permission" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULusers/remove/roll/email/": {
      "post": {
        "summary": "Remove role from user by email",
        "tags": ["Users"],
        "requestBody": {
          "required": True,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "user_email": { "type": "string", "format": "email", "example": "jane@example.com" },
                  "remover_id": { "type": "string", "example": "6993a3b2b684e1023202a5e9" },
                  "role": { "type": "string", "example": "Gym Owner" }
                },
                "required": ["user_email", "remover_id", "role"]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Role removed; updated user returned",
            "content": {
              "application/json": {
                "schema": { "type": "object" }
              }
            }
          },
          "404": {
            "description": "User not found or validation error",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string", "example": "User not found" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULusers/deactivate/id/": {
      "post": {
        "summary": "Deactivate user by id",
        "tags": ["Users"],
        "requestBody": {
          "required": True,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "user_id": { "type": "string", "example": "6993a3b2b684e1023202a5e9" },
                  "deactivator_id": { "type": "string", "example": "6993a3b2b684e1023202a5e9" },
                },
                "required": ["user_id", "deactivator_id"]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "User deactivated; updated user returned",
            "content": {
              "application/json": {
                "schema": { "type": "object" }
              }
            }
          },
          "404": {
            "description": "User not found or validation error",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string", "example": "Deactivator does not have permission" }
                  }
                }
              }
            }
          }
        }
      }
    },
    
    "/AHFULpersonalEx/": {
        "get": {
          "summary": "Get all personal exercises",
          "tags": ["PersonalEx"],
          "responses": {
            "200": {
              "description": "A list of personal exercises",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "_id":        { "type": "string", "example": "698d07b26e5117c22dd7772e" },
                        "exerciseId":{ "type": "string", "example": "698d0bc06e5117c22dd7774b" },
                        "workoutId": { "type": "string", "example": "699d05d8f1677119323250bc" },
                        "userId":    { "type": "string", "example": "699d0093795741a59fe13616" },
                        "reps":      { "type": "integer", "example": 1 },
                        "sets":      { "type": "integer", "example": 1 },
                        "weight":    { "type": "string",  "example": "1" },
                        "duration":  { "type": "number",  "example": 0 },
                        "distance":  { "type": "string",  "example": "0" },
                        "complete":  { "type": "boolean", "example": True }
                      }
                    }
                  }
                }
              }
            },
            "500": {
              "description": "Server error",
              "content": {
                "application/json": {
                  "schema": { "type": "object", "properties": { "error": { "type": "string" } } }
                }
              }
            }
          }
        }
      },

      "/AHFULpersonalEx/{userId}": {
        "get": {
          "summary": "Get all personal exercises for a specific user",
          "tags": ["PersonalEx"],
          "parameters": [
            {
              "name": "userId",
              "in": "path",
              "required": True,
              "description": "User ObjectId",
              "schema": { "type": "string", "example": "699d0093795741a59fe13616" }
            }
          ],
          "responses": {
            "200": {
              "description": "A list of personal exercises for the user",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "_id":        { "type": "string", "example": "698d07b26e5117c22dd7772e" },
                        "exerciseId":{ "type": "string", "example": "698d0bc06e5117c22dd7774b" },
                        "workoutId": { "type": "string", "example": "699d05d8f1677119323250bc" },
                        "userId":    { "type": "string", "example": "699d0093795741a59fe13616" },
                        "reps":      { "type": "integer", "example": 1 },
                        "sets":      { "type": "integer", "example": 1 },
                        "weight":    { "type": "string",  "example": "1" },
                        "duration":  { "type": "number",  "example": 0 },
                        "distance":  { "type": "string",  "example": "0" },
                        "complete":  { "type": "boolean", "example": True }
                      }
                    }
                  }
                }
              }
            },
            "500": {
              "description": "Server error",
              "content": {
                "application/json": {
                  "schema": { "type": "object", "properties": { "error": { "type": "string" } } }
                }
              }
            }
          }
        }
      },

      "/AHFULpersonalEx/workout/{workoutId}": {
        "get": {
          "summary": "Get all personal exercises for a specific workout",
          "tags": ["PersonalEx"],
          "parameters": [
            {
              "name": "workoutId",
              "in": "path",
              "required": True,
              "description": "Workout ObjectId",
              "schema": { "type": "string", "example": "699d05d8f1677119323250bc" }
            }
          ],
          "responses": {
            "200": {
              "description": "A list of personal exercises for the workout",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "_id":        { "type": "string", "example": "698d07b26e5117c22dd7772e" },
                        "exerciseId":{ "type": "string", "example": "698d0bc06e5117c22dd7774b" },
                        "workoutId": { "type": "string", "example": "699d05d8f1677119323250bc" },
                        "userId":    { "type": "string", "example": "699d0093795741a59fe13616" },
                        "reps":      { "type": "integer", "example": 1 },
                        "sets":      { "type": "integer", "example": 1 },
                        "weight":    { "type": "string",  "example": "1" },
                        "duration":  { "type": "number",  "example": 0 },
                        "distance":  { "type": "string",  "example": "0" },
                        "complete":  { "type": "boolean", "example": True }
                      }
                    }
                  }
                }
              }
            },
            "500": {
              "description": "Server error",
              "content": {
                "application/json": {
                  "schema": { "type": "object", "properties": { "error": { "type": "string" } } }
                }
              }
            }
          }
        }
      },

      "/AHFULpersonalEx/id/{id}": {
        "get": {
          "summary": "Get a single personal exercise by id",
          "tags": ["PersonalEx"],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": True,
              "description": "Personal exercise document ObjectId",
              "schema": { "type": "string", "example": "698d07b26e5117c22dd7772e" }
            }
          ],
          "responses": {
            "200": {
              "description": "Personal exercise found",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "_id":        { "type": "string", "example": "698d07b26e5117c22dd7772e" },
                      "exerciseId":{ "type": "string", "example": "698d0bc06e5117c22dd7774b" },
                      "workoutId": { "type": "string", "example": "699d05d8f1677119323250bc" },
                      "userId":    { "type": "string", "example": "699d0093795741a59fe13616" },
                      "reps":      { "type": "integer", "example": 1 },
                      "sets":      { "type": "integer", "example": 1 },
                      "weight":    { "type": "string",  "example": "1" },
                      "duration":  { "type": "number",  "example": 0 },
                      "distance":  { "type": "string",  "example": "0" },
                      "complete":  { "type": "boolean", "example": True }
                    },
                    "required": ["_id", "userId"]
                  }
                }
              }
            },
            "404": {
              "description": "Personal exercise not found",
              "content": {
                "application/json": {
                  "schema": { "type": "object", "properties": { "error": { "type": "string" } } }
                }
              }
            }
          }
        }
      },

      "/AHFULpersonalEx/create": {
        "post": {
          "summary": "Create a personal exercise",
          "tags": ["PersonalEx"],
          "requestBody": {
            "required": True,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": ["userId", "name", "gifUrl"],
                  "properties": {
                    "userId": {
                      "type": "string",
                      "description": "User ObjectId",
                      "example": "699d0093795741a59fe13616"
                    },
                    "exercise": {
                      "type": "object",
                      "description": "Full exercise definition object",
                      "properties": {
                        "_id": {
                          "type": "object",
                          "properties": {
                            "$oid": {
                              "type": "string",
                              "example": "69b22a2344f2bd681112ca8a"
                            }
                          }
                        },
                        "name": {
                          "type": "string",
                          "example": "AHFUL arm circles"
                        },
                        "gifUrl": {
                          "type": "string",
                          "example": "https://static.exercisedb.dev/media/2zNKRUB.gif"
                        },
                        "targetMuscles": {
                          "type": "array",
                          "items": { "type": "string" },
                          "example": ["forearms"]
                        },
                        "bodyParts": {
                          "type": "array",
                          "items": { "type": "string" },
                          "example": ["lower arms"]
                        },
                        "equipments": {
                          "type": "array",
                          "items": { "type": "string" },
                          "example": []
                        },
                        "secondaryMuscles": {
                          "type": "array",
                          "items": { "type": "string" },
                          "example": ["hands"]
                        },
                        "instructions": {
                          "type": "array",
                          "items": { "type": "string" },
                          "example": [
                            "Step:1 Extend your arms straight out in front of you.",
                            "Step:2 Make a fist with both hands.",
                            "Step:3 Rotate your arms in a circular motion, keeping your arms still.",
                            "Step:4 Continue the arms circles for the desired number of repetitions."
                          ]
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Personal exercise created",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "personal_ex_id": {
                        "type": "string",
                        "example": "698d07b26e5117c22dd7772e"
                      },
                      "message": {
                        "type": "string",
                        "example": "Personal Ex created"
                      }
                    },
                    "required": ["personal_ex_id", "message"]
                  }
                }
              }
            },
            "400": {
              "description": "Invalid input or creation error",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "error": { "type": "string" }
                    }
                  }
                }
              }
            }
          }
        }
      },

      "/AHFULpersonalEx/delete/{personal_ex_id}": {
      "delete": {
        "summary": "Delete personal ex by id",
        "tags": ["PersonalEx"],
        "parameters": [
          {
            "name": "personal_ex_id",
            "in": "path",
            "required": True,
            "description": "The id of the personal ex (Mongo ObjectId as string)",
            "schema": { "type": "string", "example": "698d039a6e5117c22dd7771d" }
          }
        ],
        "responses": {
          "200": {
            "description": "Personal ex deleted successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": { "type": "string", "example": "Personal ex deleted" },
                    "gym_id": { "type": "string", "example": "698d039a6e5117c22dd7771d" }
                  },
                  "required": ["message", "personal_ex_id"]
                }
              }
            }
          },
          "404": {
            "description": "Personal ex not found or already deleted",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string", "example": "Personal ex not found or already deleted" }
                  },
                  "required": ["error"]
                }
              }
            }
          },
          "400": {
            "description": "Invalid id format or missing id",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string", "example": "You must provide a personal ex id to delete" }
                  },
                  "required": ["error"]
                }
              }
            }
          },
          "500": {
            "description": "Server error",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  },
                  "required": ["error"]
                }
              }
            }
          }
        }
      }
    },

    
    "/AHFULpersonalEx/update/{personal_ex_id}": {
      "put": {
        "summary": "Update a personal exercise",
        "description": "Updates allowed fields of a personal exercise by id. Server treats PUT as a partial update of allowed fields.",
        "tags": ["PersonalEx"],
        "parameters": [
          {
            "name": "personal_ex_id",
            "in": "path",
            "required": True,
            "description": "The id of the personal exercise (Mongo ObjectId as string)",
            "schema": { "type": "string", "example": "698d07b26e5117c22dd7772e" }
          }
        ],
        "requestBody": {
          "required": True,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "reps":     { "type": "integer", "example": 10 },
                  "sets":     { "type": "integer", "example": 5 },
                  "weight":   { "type": "string",  "example": "135" },
                  "duration": { "type": "number",  "example": 0 },
                  "distance": { "type": "string",  "example": "0" },
                  "complete": { "type": "boolean", "example": True }
                },
                "additionalProperties": False
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Personal exercise updated successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": { "type": "string", "example": "Personal ex updated" },
                    "personal_ex": {
                      "type": "object",
                      "properties": {
                        "_id":        { "type": "string", "example": "698d07b26e5117c22dd7772e" },
                        "exerciseId":{ "type": "string", "example": "698d0bc06e5117c22dd7774b" },
                        "workoutId": { "type": "string", "example": "699d05d8f1677119323250bc" },
                        "userId":    { "type": "string", "example": "699d0093795741a59fe13616" },
                        "reps":      { "type": "integer", "example": 10 },
                        "sets":      { "type": "integer", "example": 5 },
                        "weight":    { "type": "string",  "example": "135" },
                        "duration":  { "type": "number",  "example": 0 },
                        "distance":  { "type": "string",  "example": "0" },
                        "complete":  { "type": "boolean", "example": True }
                      },
                      "required": ["_id", "userId"]
                    }
                  },
                  "required": ["message", "personal_ex"]
                }
              }
            }
          },
          "400": {
            "description": "Invalid input or no valid fields to update",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string", "example": "You must provide a JSON body with at least one field to update" }
                  },
                  "required": ["error"]
                }
              }
            }
          },
          "404": {
            "description": "Personal exercise not found",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string", "example": "PersonalEx not found" }
                  },
                  "required": ["error"]
                }
              }
            }
          },
          "500": {
            "description": "Server error",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  },
                  "required": ["error"]
                }
              }
            }
          }
        }
      }
    },

      "/AHFULexercises/": {
        "get": {
          "summary": "Get all exercises",
          "tags": ["Exercises"],
          "responses": {
            "200": {
              "description": "A list of exercises",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "_id":          { "type": "string", "example": "698d0bc06e5117c22dd7774b" },
                        "name":         { "type": "string", "example": "Dumbbell Bench Press" },
                        "muscle_group": { "type": "string", "example": "Chest" },
                        "difficulty":   { "type": "string", "example": "Intermediate" },
                        "equipment":    { "type": "string", "example": "Dumbbells, Flat Bench" },
                        "instructions": { "type": "string", "example": "Lie on a flat bench with a dumbbell in each hand..." },
                        "type":         { "type": "string", "example": "Strength" }
                      }
                    }
                  }
                }
              }
            },
            "500": {
              "description": "Server error",
              "content": {
                "application/json": {
                  "schema": { "type": "object", "properties": { "error": { "type": "string" } } }
                }
              }
            }
          }
        }
      },

      "/AHFULexercises/id/{exercise_id}": {
        "get": {
          "summary": "Get a single exercise by id",
          "tags": ["Exercises"],
          "parameters": [
            {
              "name": "exercise_id",
              "in": "path",
              "required": True,
              "description": "Exercise ObjectId",
              "schema": { "type": "string", "example": "698d0bc06e5117c22dd7774b" }
            }
          ],
          "responses": {
            "200": {
              "description": "Exercise found",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "_id":          { "type": "string", "example": "698d0bc06e5117c22dd7774b" },
                      "name":         { "type": "string", "example": "Dumbbell Row" },
                      "muscle_group": { "type": "string", "example": "Back" },
                      "difficulty":   { "type": "string", "example": "Beginner" },
                      "equipment":    { "type": "string", "example": "Dumbbells, Bench" },
                      "instructions": { "type": "string", "example": "Support one knee and hand on a bench..." },
                      "type":         { "type": "string", "example": "Strength" }
                    },
                    "required": ["_id", "name"]
                  }
                }
              }
            },
            "404": {
              "description": "Exercise not found",
              "content": {
                "application/json": {
                  "schema": { "type": "object", "properties": { "error": { "type": "string" } } }
                }
              }
            },
            "500": {
              "description": "Server error",
              "content": {
                "application/json": {
                  "schema": { "type": "object", "properties": { "error": { "type": "string" } } }
                }
              }
            }
          }
        }
      },

      "/AHFULexercises/search": {
        "get": {
          "summary": "Search exercises",
          "tags": ["Exercises"],
          "parameters": [
            {
              "name": "search",
              "in": "query",
              "required": True,
              "description": "Free-text search query",
              "schema": { "type": "string", "example": "dumbbell" }
            }
          ],
          "responses": {
            "200": {
              "description": "Matching exercises",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "_id":          { "type": "string", "example": "698d0bc06e5117c22dd7774b" },
                        "name":         { "type": "string", "example": "Incline Dumbbell Bench Press" },
                        "muscle_group": { "type": "string", "example": "Chest" },
                        "difficulty":   { "type": "string", "example": "Intermediate" },
                        "equipment":    { "type": "string", "example": "Dumbbells, Incline Bench" },
                        "instructions": { "type": "string", "example": "Set bench to 30–45°, press dumbbells upward..." },
                        "type":         { "type": "string", "example": "Strength" }
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Missing or invalid search query",
              "content": {
                "application/json": {
                  "schema": { "type": "object", "properties": { "error": { "type": "string", "example": "No search query provided" } } }
                }
              }
            },
            "404": {
              "description": "No results or search error",
              "content": {
                "application/json": {
                  "schema": { "type": "object", "properties": { "error": { "type": "string" } } }
                }
              }
            },
            "500": {
              "description": "Server error",
              "content": {
                "application/json": {
                  "schema": { "type": "object", "properties": { "error": { "type": "string" } } }
                }
              }
            }
          }
        }
      },

      "/AHFULexercises/create/": {
        "post": {
          "summary": "Create an exercise",
          "tags": ["Exercises"],
          "requestBody": {
            "required": True,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": ["name"],
                  "properties": {
                    "name":         { "type": "string", "description": "Exercise name", "example": "Barbell Back Squat" },
                    "muscle_group": { "type": "string", "description": "Primary muscle group", "example": "Legs" },
                    "difficulty":   { "type": "string", "description": "Difficulty level", "example": "Intermediate" },
                    "equipment":    { "type": "string", "description": "Equipment required", "example": "Barbell, Squat Rack" },
                    "instructions": { "type": "string", "description": "Step-by-step instructions", "example": "Position the barbell across your traps..." },
                    "type":         { "type": "string", "description": "Exercise category/type", "example": "Strength" }
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Exercise created",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "exercise_id": { "type": "string", "example": "698d0bc06e5117c22dd7774b" },
                      "message":     { "type": "string", "example": "Exercise created" }
                    },
                    "required": ["exercise_id", "message"]
                  }
                }
              }
            },
            "400": {
              "description": "Invalid input or creation error",
              "content": {
                "application/json": {
                  "schema": { "type": "object", "properties": { "error": { "type": "string" } } }
                }
              }
            },
            "500": {
              "description": "Server error",
              "content": {
                "application/json": {
                  "schema": { "type": "object", "properties": { "error": { "type": "string" } } }
                }
              }
            }
          }
        }
      },

      "/AHFULexercises/delete/{exercise_id}": {
        "delete": {
          "summary": "Delete an exercise by id",
          "tags": ["Exercises"],
          "parameters": [
            {
              "name": "exercise_id",
              "in": "path",
              "required": True,
              "description": "The id of the exercise (Mongo ObjectId as string)",
              "schema": { "type": "string", "example": "698d0bc06e5117c22dd7774b" }
            }
          ],
          "responses": {
            "200": {
              "description": "Exercise deleted successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "message":     { "type": "string", "example": "Exercise deleted successfully" },
                      "exercise_id": { "type": "string", "example": "698d0bc06e5117c22dd7774b" }
                    },
                    "required": ["message", "exercise_id"]
                  }
                }
              }
            },
            "400": {
              "description": "Invalid id format or missing id",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "error": { "type": "string", "example": "You must provide an exercise id to delete" }
                    },
                    "required": ["error"]
                  }
                }
              }
            },
            "404": {
              "description": "Exercise not found or already deleted",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "error": { "type": "string", "example": "Exercise not found or already deleted" }
                    },
                    "required": ["error"]
                  }
                }
              }
            },
            "500": {
              "description": "Server error",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "error": { "type": "string" }
                    },
                    "required": ["error"]
                  }
                }
              }
            }
          }
        }
      },

    "/AHFULworkout/": {
      "get": {
        "summary": "Get all workouts",
        "tags": ["Workout"],
        "responses": {
          "200": {
            "description": "A list of workouts",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": { "type": "object" }
                }
              }
            }
          },
          "500": {
            "description": "Server error",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULworkout/{userId}": {
      "get": {
        "summary": "Get workouts by user id",
        "tags": ["Workout"],
        "parameters": [
          {
            "name": "userId",
            "in": "path",
            "required": True,
            "description": "User Id of the user",
            "schema": { "type": "string"}
          }
        ],
        "responses": {
          "200": {
            "description": "User found",
            
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "_id": { "type": "string", "example": "6993a3b2b684e1023202a5e9" },
                    "userId": { "type": "string", "format": "email", "example": "anEmail@email.com" },
                    "title": { "type": "string", "example": "Daily workout" },
                    "gymId": { "type": "string", "example": 0 },
                    "startTime": { "type": "integer", "example": 0 },
                    "endTime": { "type": "integer", "example": 0 }
                  },
                "required": ["_id", "email", "startTime"]
                }
              }
            }

          },
          "404": {
            "description": "Workouts not found",
            "content": {
              "application/json": {
                "schema": { 
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULworkout/templates/{userId}": {
      "get": {
        "summary": "Get templates by user id",
        "tags": ["Workout"],
        "parameters": [
          {
            "name": "userId",
            "in": "path",
            "required": True,
            "description": "User Id of the user",
            "schema": { "type": "string"}
          }
        ],
        "responses": {
          "200": {
            "description": "Templates found",
            
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "_id": { "type": "string", "example": "6993a3b2b684e1023202a5e9" },
                    "userId": { "type": "string", "format": "email", "example": "anEmail@email.com" },
                    "title": { "type": "string", "example": "Daily workout" },
                    "startTime": { "type": "integer", "example": 0 },
                  },
                "required": ["_id", "email", "startTime"]
                }
              }
            }

          },
          "404": {
            "description": "Templates not found",
            "content": {
              "application/json": {
                "schema": { 
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULworkout/id/{id}": {
      "get": {
        "summary": "Get workout by id",
        "tags": ["Workout"],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": True,
            "description": "id of the workout",
            "schema": { "type": "string"}
          }
        ],
        "responses": {
          "200": {
            "description": "Workout found",
            
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "_id": { "type": "string", "example": "698d039a6e5117c22dd7771d" }
                  },
                "required": ["_id"]
                }
              }
            }

          },
          "404": {
            "description": "Workout not found",
            "content": {
              "application/json": {
                "schema": { 
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULworkout/create": {
      "post": {
        "summary": "Create a new workout",
        "tags": ["Workout"],
        "requestBody": {
          "required": True,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["email", "start_time"],
                "properties": {
                  "title": { "type": "string", "example": "A workout" },
                  "userId": { "type": "string", "example": "699d0093795741a59fe13616" },
                  "gymId": { "type": "string", "example": "699d022c795741a59fe1361f" },
                  "startTime": { "type": "int", "example": "0" },
                  "endTime": { "type": "int", "example": "0" }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Workout created successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "email": { "type": "string", "format": "email" },
                    "message": { "type": "string", "example": "User created successfully" }
                  },
                  "required": ["email", "message"]
                }
              }
            }
          },
          "400": {
            "description": "Invalid input or creation error",
            "content": {
              "application/json": {
                "schema": { 
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULworkout/delete/{workout_id}": {
      "delete": {
        "summary": "Delete workout by id",
        "tags": ["Workout"],
        "parameters": [
          {
            "name": "workout_id",
            "in": "path",
            "required": True,
            "description": "The id of the workout (Mongo ObjectId as string)",
            "schema": { "type": "string", "example": "698d039a6e5117c22dd7771d" }
          }
        ],
        "responses": {
          "200": {
            "description": "Workout deleted successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": { "type": "string", "example": "Workout deleted" },
                    "gym_id": { "type": "string", "example": "698d039a6e5117c22dd7771d" }
                  },
                  "required": ["message", "workout_id"]
                }
              }
            }
          },
          "404": {
            "description": "Workout not found or already deleted",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string", "example": "Workout not found or already deleted" }
                  },
                  "required": ["error"]
                }
              }
            }
          },
          "400": {
            "description": "Invalid id format or missing id",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string", "example": "You must provide a workout id to delete" }
                  },
                  "required": ["error"]
                }
              }
            }
          },
          "500": {
            "description": "Server error",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  },
                  "required": ["error"]
                }
              }
            }
          }
        }
      }
    },

    "/AHFULworkout/update/{workout_id}": {
      "put": {
        "summary": "Update a workout",
        "description": "Updates allowed fields of a workout by id. Server treats PUT as a partial update of allowed fields.",
        "tags": ["Workout"],
        "parameters": [
          {
            "name": "workout_id",
            "in": "path",
            "required": True,
            "description": "The id of the workout (Mongo ObjectId as string)",
            "schema": { "type": "string", "example": "698d07b26e5117c22dd7772e" }
          }
        ],
        "requestBody": {
          "required": True,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "startTime":     { "type": "integer", "example": 100 },
                  "endTime":     { "type": "integer", "example": 200 },
                  "title":   { "type": "string",  "example": "An example workout" }
                },
                "additionalProperties": False
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Workout updated successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": { "type": "string", "example": "Workout updated" },
                    "workout": {
                      "type": "object",
                      "properties": {
                        "_id":        { "type": "string", "example": "69af2a4598d0f4227b25ed71" },
                        "gymId":{ "type": "string", "example": "698d0bc06e5117c22dd7774b" },
                        "userId":    { "type": "string", "example": "699d0093795741a59fe13616" },
                        "endTime":      { "type": "integer", "example": 10 },
                        "startTime":      { "type": "integer", "example": 5 },
                        "title":    { "type": "string",  "example": "A workout"}
                      },
                      "required": ["_id", "userId"]
                    }
                  },
                  "required": ["message", "workout"]
                }
              }
            }
          },
          "400": {
            "description": "Invalid input or no valid fields to update",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string", "example": "You must provide a JSON body with at least one field to update" }
                  },
                  "required": ["error"]
                }
              }
            }
          },
          "404": {
            "description": "Workout not found",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string", "example": "Workout not found" }
                  },
                  "required": ["error"]
                }
              }
            }
          },
          "500": {
            "description": "Server error",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  },
                  "required": ["error"]
                }
              }
            }
          }
        }
      }
    },

    
    "/AHFULgyms/": {
      "get": {
        "summary": "Get all gyms",
        "tags": ["Gym"],
        "responses": {
          "200": {
            "description": "A list of gyms",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "_id": { "type": "string", "example": "698d039a6e5117c22dd7771d" },
                      "title": { "type": "string", "example": "Downtown Fitness" },
                      "address": { "type": "string", "example": "123 Main St, Anytown, USA" },
                      "cost": { "type": "number", "example": 49.99 },
                      "link": { "type": "string", "format": "uri", "example": "https://examplegym.com" }
                    },
                    "required": ["_id", "title", "address"]
                  }
                }
              }
            }
          },
          "500": {
            "description": "Server error",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    
    "/AHFULgyms/{gym_id}": {
      "get": {
        "summary": "Get gym by id",
        "tags": ["Gym"],
        "parameters": [
          {
            "name": "gym_id",
            "in": "path",
            "required": True,
            "description": "The id of the gym (Mongo ObjectId as string)",
            "schema": { "type": "string" }
          }
        ],
        "responses": {
          "200": {
            "description": "Gym found",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "_id": { "type": "string", "example": "698d039a6e5117c22dd7771d" },
                    "title": { "type": "string", "example": "Downtown Fitness" },
                    "address": { "type": "string", "example": "123 Main St, Anytown, USA" },
                    "cost": { "type": "number", "example": 49.99 },
                    "link": { "type": "string", "format": "uri", "example": "https://examplegym.com" }
                  },
                  "required": ["_id", "title", "address"]
                }
              }
            }
          },
          "404": {
            "description": "Gym not found",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    
    "/AHFULgyms/create": {
      "post": {
        "summary": "Create a new gym",
        "tags": ["Gym"],
        "requestBody": {
          "required": True,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["title", "address"],
                "properties": {
                  "title": { "type": "string", "example": "Downtown Fitness" },
                  "address": { "type": "string", "example": "123 Main St, Anytown, USA" },
                  "cost": { "type": "number", "example": 49.99 },
                  "link": { "type": "string", "format": "uri", "example": "https://examplegym.com" }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Gym created successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "gym_id": { "type": "string", "example": "698d039a6e5117c22dd7771d" },
                    "message": { "type": "string", "example": "Gym created" }
                  },
                  "required": ["gym_id", "message"]
                }
              }
            }
          },
          "400": {
            "description": "Invalid input or creation error",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    
    "/AHFULgyms/delete/{gym_id}": {
      "delete": {
        "summary": "Delete gym by id",
        "tags": ["Gym"],
        "parameters": [
          {
            "name": "gym_id",
            "in": "path",
            "required": True,
            "description": "The id of the gym (Mongo ObjectId as string)",
            "schema": { "type": "string", "example": "698d039a6e5117c22dd7771d" }
          }
        ],
        "responses": {
          "200": {
            "description": "Gym deleted successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": { "type": "string", "example": "Gym deleted" },
                    "gym_id": { "type": "string", "example": "698d039a6e5117c22dd7771d" }
                  },
                  "required": ["message", "gym_id"]
                }
              }
            }
          },
          "404": {
            "description": "Gym not found or already deleted",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string", "example": "Gym not found or already deleted" }
                  },
                  "required": ["error"]
                }
              }
            }
          },
          "400": {
            "description": "Invalid id format or missing id",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string", "example": "You must provide a gym id to delete" }
                  },
                  "required": ["error"]
                }
              }
            }
          },
          "500": {
            "description": "Server error",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  },
                  "required": ["error"]
                }
              }
            }
          }
        }
      }
    },
    
    "/AHFULgyms/update/{gym_id}": {
      "put": {
        "summary": "Update a gym",
        "description": "Updates allowed fields of a gym by id. The server treats PUT as a partial update.",
        "tags": ["Gym"],
        "parameters": [
          {
            "name": "gym_id",
            "in": "path",
            "required": True,
            "description": "The id of the gym (Mongo ObjectId as string)",
            "schema": { "type": "string", "example": "698d039a6e5117c22dd7771d" }
          }
        ],
        "requestBody": {
          "required": True,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "name":    { "type": "string", "example": "Downtown Fitness" },
                  "address": { "type": "string", "example": "123 Main St, Anytown, USA" },
                  "cost":    { "type": "number", "example": 49.99 },
                  "link":    { "type": "string", "format": "uri", "example": "https://examplegym.com" },
                  "lat":     { "type": "number", "example": 44.876 },
                  "lng":     { "type": "number", "example": -91.932 },
                  "notes":   { "type": "string", "example": "24/7 access; towels included" }
                },
                "additionalProperties": False
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Gym updated successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": { "type": "string", "example": "Gym updated" },
                    "gym": {
                      "type": "object",
                      "properties": {
                        "_id":     { "type": "string", "example": "698d039a6e5117c22dd7771d" },
                        "name":    { "type": "string", "example": "Downtown Fitness" },
                        "address": { "type": "string", "example": "123 Main St, Anytown, USA" },
                        "cost":    { "type": "number", "example": 49.99 },
                        "link":    { "type": "string", "format": "uri", "example": "https://examplegym.com" },
                        "lat":     { "type": "number", "example": 44.876 },
                        "lng":     { "type": "number", "example": -91.932 },
                        "notes":   { "type": "string", "example": "24/7 access; towels included" }
                      },
                      "required": ["_id", "name", "address"]
                    }
                  },
                  "required": ["message", "gym"]
                }
              }
            }
          },
          "400": {
            "description": "Invalid input or no valid fields to update",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string", "example": "You must provide a JSON body with at least one field to update" }
                  },
                  "required": ["error"]
                }
              }
            }
          },
          "404": {
            "description": "Gym not found",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string", "example": "Gym not found" }
                  },
                  "required": ["error"]
                }
              }
            }
          },
          "500": {
            "description": "Server error",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  },
                  "required": ["error"]
                }
              }
            }
          }
        }
      }
    },

    "/AHFULfood/": {
      "get": {
        "summary": "Get all foods",
        "tags": ["Food"],
        "responses": {
          "200": {
            "description": "A list of foods",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "_id": { "type": "string", "example": "698d0bc06e5117c22dd7774b" },
                      "userId": { "type": "string", "example": "abc123" },
                      "name": { "type": "string", "example": "Apple" },
                      "calsPerServing": { "type": "number", "example": 95 },
                      "servings": { "type": "number", "example": 1 },
                      "type": { "type": "string", "example": "Lunch" },
                      "time": { "type": "integer", "example": 1708473600 }
                    },
                    "required": ["_id", "userId", "name", "calsPerServing", "servings", "time"]
                  }
                }
              }
            }
          },
          "500": {
            "description": "Server error",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULfood/{userId}": {
      "get": {
        "summary": "Get foods by userId",
        "tags": ["Food"],
        "parameters": [
          {
            "name": "userId",
            "in": "path",
            "required": True,
            "description": "The user id associated with the foods",
            "schema": { "type": "string" }
          }
        ],
        "responses": {
          "200": {
            "description": "Foods for the specified user",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "_id": { "type": "string", "example": "698d0bc06e5117c22dd7774b" },
                      "userId": { "type": "string", "example": "abc123" },
                      "name": { "type": "string", "example": "Apple" },
                      "calsPerServing": { "type": "number", "example": 95 },
                      "servings": { "type": "number", "example": 1 },
                      "type": { "type": "string", "example": "Lunch" },
                      "time": { "type": "integer", "example": 1708473600 }
                    },
                    "required": ["_id", "userId", "name", "calsPerServing", "servings", "time"]
                  }
                }
              }
            }
          },
          "404": {
            "description": "Foods not found",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULfood/id/{id}": {
      "get": {
        "summary": "Get food by id",
        "tags": ["Food"],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": True,
            "description": "Food id",
            "schema": { "type": "string"}
          }
        ],
        "responses": {
          "200": {
            "description": "Food found",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                      "_id": { "type": "string", "example": "698d0bc06e5117c22dd7774b" },
                      "userId": { "type": "string", "example": "abc123" },
                      "name": { "type": "string", "example": "Apple" },
                      "calsPerServing": { "type": "number", "example": 95 },
                      "servings": { "type": "number", "example": 1 },
                      "type": { "type": "string", "example": "Lunch" },
                      "time": { "type": "integer", "example": 1708473600 }
                    },
                    "required": ["_id", "userId", "name", "calsPerServing", "servings", "time"]
                }
              }
            }
          },
          "404": {
            "description": "Food not found",
            "content": {
              "application/json": {
                "schema": { 
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULfood/create": {
      "post": {
        "summary": "Create a new food entry",
        "tags": ["Food"],
        "requestBody": {
          "required": True,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["userId", "name", "calsPerServing", "servings", "time"],
                "properties": {
                  "userId": { "type": "string", "example": "abc123" },
                  "name": { "type": "string", "example": "Apple" },
                  "calsPerServing": { "type": "number", "example": 95 },
                  "servings": { "type": "number", "example": 1 },
                  "type": { "type": "string", "example": "Lunch" },
                  "time": { "type": "integer", "example": 1708473600 }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Food created successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "food_id": { "type": "string", "example": "698d0bc06e5117c22dd7774b" },
                    "message": { "type": "string", "example": "Food created" }
                  },
                  "required": ["food_id", "message"]
                }
              }
            }
          },
          "400": {
            "description": "Invalid input or creation error",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULfood/delete/{food_id}": {
      "delete": {
        "summary": "Delete food by id",
        "tags": ["Food"],
        "parameters": [
          {
            "name": "food_id",
            "in": "path",
            "required": True,
            "description": "The id of the food (Mongo ObjectId as string)",
            "schema": { "type": "string", "example": "698d039a6e5117c22dd6661d" }
          }
        ],
        "responses": {
          "200": {
            "description": "Food deleted successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": { "type": "string", "example": "Food deleted" },
                    "gym_id": { "type": "string", "example": "698d039a6e5117c22dd7771d" }
                  },
                  "required": ["message", "food_id"]
                }
              }
            }
          },
          "404": {
            "description": "Food not found or already deleted",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string", "example": "Food not found or already deleted" }
                  },
                  "required": ["error"]
                }
              }
            }
          },
          "400": {
            "description": "Invalid id format or missing id",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string", "example": "You must provide a food id to delete" }
                  },
                  "required": ["error"]
                }
              }
            }
          },
          "500": {
            "description": "Server error",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  },
                  "required": ["error"]
                }
              }
            }
          }
        }
      }
    }, 

    "/AHFULfood/update/{food_id}": {
      "put": {
        "summary": "Update a food entry",
        "description": "Updates allowed fields of a food entry by id. The server treats PUT as a partial update of allowed fields.",
        "tags": ["Food"],
        "parameters": [
          {
            "name": "food_id",
            "in": "path",
            "required": True,
            "description": "The id of the food entry (Mongo ObjectId as string)",
            "schema": { "type": "string", "example": "699d0f5f888d8f649698307e" }
          }
        ],
        "requestBody": {
          "required": True,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "name":           { "type": "string",  "example": "Banana" },
                  "calsPerServing": { "type": "integer", "example": 105 },
                  "servings":       { "type": "integer", "example": 2 },
                  "type":           { "type": "string",  "example": "Snack" },
                  "time":           { "type": "number",  "example": 1708473601 }
                },
                "additionalProperties": False
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Food updated successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "_id":            { "type": "string",  "example": "699d0f5f888d8f649698307e" },
                    "userId":         { "type": "string",  "example": "699d0093795741a59fe13616" },
                    "name":           { "type": "string",  "example": "Banana" },
                    "calsPerServing": { "type": "integer", "example": 105 },
                    "servings":       { "type": "integer", "example": 2 },
                    "type":           { "type": "string",  "example": "Snack" },
                    "time":           { "type": "number",  "example": 1708473601 }
                  },
                  "required": ["_id", "userId", "name", "calsPerServing", "servings", "type", "time"]
                }
              }
            }
          },
          "400": {
            "description": "Invalid input or update error",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string", "example": "No data provided" }
                  },
                  "required": ["error"]
                }
              }
            }
          },
          "404": {
            "description": "Food not found",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string", "example": "Food not found" }
                  },
                  "required": ["error"]
                }
              }
            }
          },
          "500": {
            "description": "Server error",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  },
                  "required": ["error"]
                }
              }
            }
          }
        }
      }
    },
    "/AHFULmeasurements/": {
      "get": {
        "summary": "Get all measurements",
        "tags": ["Measurements"],
        "responses": {
          "200": {
            "description": "A list of measurements",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": { "type": "object" }
                }
              }
            }
          },
          "500": {
            "description": "Server error",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULmeasurements/{user_id}": {
      "get": {
        "summary": "Get measurements by user id",
        "tags": ["Measurements"],
        "parameters": [
          {
            "name": "user_id",
            "in": "path",
            "required": True,
            "description": "User ObjectId",
            "schema": { "type": "string", "example": "699d0093795741a59fe13616" }
          }
        ],
        "responses": {
          "200": {
            "description": "Measurements found for the user",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": { "type": "object" }
                }
              }
            }
          },
          "400": {
            "description": "Error retrieving measurements",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULmeasurements/id/{measurement_id}": {
      "get": {
        "summary": "Get a single measurement by id",
        "tags": ["Measurements"],
        "parameters": [
          {
            "name": "measurement_id",
            "in": "path",
            "required": True,
            "description": "Measurement ObjectId",
            "schema": { "type": "string", "example": "698d039a6e5117c22dd7771d" }
          }
        ],
        "responses": {
          "200": {
            "description": "Measurement found",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "_id": { "type": "string", "example": "698d039a6e5117c22dd7771d" },
                    "userId": { "type": "string", "example": "699d0093795741a59fe13616" }
                  }
                }
              }
            }
          },
          "404": {
            "description": "Measurement not found",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULmeasurements/create": {
      "post": {
        "summary": "Create a new measurement",
        "tags": ["Measurements"],
        "requestBody": {
          "required": True,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["userId"],
                "properties": {
                  "userId": { "type": "string", "description": "User ObjectId", "example": "699d0093795741a59fe13616" }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Measurement created successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "measurement_id": { "type": "string", "example": "698d039a6e5117c22dd7771d" },
                    "message": { "type": "string", "example": "Measurement created" }
                  },
                  "required": ["measurement_id", "message"]
                }
              }
            }
          },
          "400": {
            "description": "Invalid input or creation error",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULmeasurements/update/{measurement_id}": {
      "put": {
        "summary": "Update a measurement",
        "description": "Updates allowed fields of a measurement by id. The server treats PUT as a partial update.",
        "tags": ["Measurements"],
        "parameters": [
          {
            "name": "measurement_id",
            "in": "path",
            "required": True,
            "description": "The id of the measurement (Mongo ObjectId as string)",
            "schema": { "type": "string", "example": "698d039a6e5117c22dd7771d" }
          }
        ],
        "requestBody": {
          "required": True,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "data": { "type": "object", "description": "Measurement data fields to update" }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Measurement updated successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          },
          "400": {
            "description": "Invalid input or no valid fields to update",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string", "example": "You must provide a JSON body with at least one field to update" }
                  }
                }
              }
            }
          },
          "404": {
            "description": "Measurement not found",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULmeasurements/delete/{measurement_id}": {
      "delete": {
        "summary": "Delete a measurement by id",
        "tags": ["Measurements"],
        "parameters": [
          {
            "name": "measurement_id",
            "in": "path",
            "required": True,
            "description": "The id of the measurement (Mongo ObjectId as string)",
            "schema": { "type": "string", "example": "698d039a6e5117c22dd7771d" }
          }
        ],
        "responses": {
          "200": {
            "description": "Measurement deleted successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": { "type": "string", "example": "Measurement deleted" },
                    "measurement_id": { "type": "string", "example": "698d039a6e5117c22dd7771d" }
                  },
                  "required": ["message", "measurement_id"]
                }
              }
            }
          },
          "400": {
            "description": "Error deleting measurement",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULauth/google-login": {
      "post": {
        "summary": "Login with Google",
        "tags": ["Auth"],
        "requestBody": {
          "required": True,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["token"],
                "properties": {
                  "token": { "type": "string", "description": "Google JWT token", "example": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..." }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Login successful",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": { "type": "string", "example": "Login successful" },
                    "user_info": { "type": "object", "description": "User information object" }
                  }
                }
              }
            }
          },
          "400": {
            "description": "No authentication data provided",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string", "example": "No authentication data provided" }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Invalid or disabled account",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string", "example": "Your account has been disabled" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULauth/snapchat-login": {
      "post": {
        "summary": "Login with Snapchat",
        "tags": ["Auth"],
        "requestBody": {
          "required": True,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["token"],
                "properties": {
                  "token": { "type": "string", "description": "Snapchat authentication token", "example": "snap_token_here" }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Login successful",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": { "type": "string", "example": "Login successful" },
                    "user_info": { "type": "object", "description": "User information object" }
                  }
                }
              }
            }
          },
          "400": {
            "description": "No authentication data provided",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string", "example": "No authentication data provided" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULauth/logout": {
      "post": {
        "summary": "Logout user",
        "tags": ["Auth"],
        "requestBody": {
          "required": True,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["logout_email"],
                "properties": {
                  "logout_email": { "type": "string", "format": "email", "description": "Email of user to logout", "example": "user@example.com" }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Logout successful",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": { "type": "string", "example": "Logout successful" }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Logout failed",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": { "type": "string", "example": "Logout failed" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULauth/whoami": {
      "post": {
        "summary": "Check authentication status",
        "description": "Verify if a user is authenticated and their session is valid",
        "tags": ["Auth"],
        "requestBody": {
          "required": True,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["email", "last_login_expire", "magic_bits"],
                "properties": {
                  "email": { "type": "string", "format": "email", "description": "User email", "example": "user@example.com" },
                  "last_login_expire": { "type": "integer", "description": "Token expiration timestamp", "example": 1708550400 },
                  "magic_bits": { "type": "string", "description": "Session magic bits for validation", "example": "abcdef1234567890abcdef12345678" }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "User is authenticated and authorized",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": { "type": "string", "example": "Authorized and Found User." },
                    "user_info": { "type": "object", "description": "User information object" }
                  }
                }
              }
            }
          },
          "200": {
            "description": "Token expired or invalid request",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string", "example": "Token Expired, User will need to Auth Again" }
                  }
                }
              }
            }
          },
          "200": {
            "description": "User not found",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string", "example": "Email NOT found, User will need to Auth" }
                  }
                }
              }
            }
          },
          "200": {
            "description": "Magic bits mismatch",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string", "example": "Your Bits are overcooked, User will need to Auth Again" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULtasks/{task_id}": {
      "get": {
        "summary": "Get task by id",
        "tags": ["Task"],
        "parameters": [
          {
            "name": "task_id",
            "in": "path",
            "required": True,
            "description": "Task ObjectId",
            "schema": { "type": "string", "example": "698d039a6e5117c22dd7771d" }
          }
        ],
        "responses": {
          "200": {
            "description": "Task found",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          },
          "404": {
            "description": "Task not found",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULtasks/user/{user_id}": {
      "get": {
        "summary": "Get tasks by user id",
        "tags": ["Task"],
        "parameters": [
          {
            "name": "user_id",
            "in": "path",
            "required": True,
            "description": "User ObjectId",
            "schema": { "type": "string", "example": "699d0093795741a59fe13616" }
          }
        ],
        "responses": {
          "200": {
            "description": "Tasks found for the user",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": { "type": "object" }
                }
              }
            }
          },
          "404": {
            "description": "Tasks not found",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULtasks/create/{user_id}": {
      "post": {
        "summary": "Create a new task",
        "tags": ["Task"],
        "parameters": [
          {
            "name": "user_id",
            "in": "path",
            "required": True,
            "description": "User ObjectId to associate task with",
            "schema": { "type": "string", "example": "699d0093795741a59fe13616" }
          }
        ],
        "requestBody": {
          "required": True,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "data": { "type": "object", "description": "Task data fields" }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Task created successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          },
          "400": {
            "description": "Invalid input or creation error",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULtasks/update/{task_id}": {
      "put": {
        "summary": "Update a task",
        "tags": ["Task"],
        "parameters": [
          {
            "name": "task_id",
            "in": "path",
            "required": True,
            "description": "Task ObjectId",
            "schema": { "type": "string", "example": "698d039a6e5117c22dd7771d" }
          }
        ],
        "requestBody": {
          "required": True,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "data": { "type": "object", "description": "Task data fields to update" }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Task updated successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          },
          "400": {
            "description": "Invalid input or update error",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULtasks/delete/{task_id}": {
      "delete": {
        "summary": "Delete a task by id",
        "tags": ["Task"],
        "parameters": [
          {
            "name": "task_id",
            "in": "path",
            "required": True,
            "description": "Task ObjectId",
            "schema": { "type": "string", "example": "698d039a6e5117c22dd7771d" }
          }
        ],
        "responses": {
          "200": {
            "description": "Task deleted successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          },
          "404": {
            "description": "Task not found",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULtokens/user/{user_id}": {
      "get": {
        "summary": "Get token by user id",
        "tags": ["Token"],
        "parameters": [
          {
            "name": "user_id",
            "in": "path",
            "required": True,
            "description": "User ObjectId",
            "schema": { "type": "string", "example": "699d0093795741a59fe13616" }
          }
        ],
        "responses": {
          "200": {
            "description": "Token found",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          },
          "404": {
            "description": "Token not found",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULtokens/value/{token}": {
      "get": {
        "summary": "Get token by value",
        "tags": ["Token"],
        "parameters": [
          {
            "name": "token",
            "in": "path",
            "required": True,
            "description": "Token value",
            "schema": { "type": "string", "example": "some_token_value" }
          }
        ],
        "responses": {
          "200": {
            "description": "Token found",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          },
          "404": {
            "description": "Token not found",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULtokens/create/{user_id}": {
      "post": {
        "summary": "Create a token for user",
        "tags": ["Token"],
        "parameters": [
          {
            "name": "user_id",
            "in": "path",
            "required": True,
            "description": "User ObjectId",
            "schema": { "type": "string", "example": "699d0093795741a59fe13616" }
          }
        ],
        "requestBody": {
          "required": True,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["token"],
                "properties": {
                  "token": { "type": "string", "description": "Token value", "example": "new_token_value" }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Token created successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          },
          "400": {
            "description": "Token is required",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string", "example": "token is required" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULtokens/delete/user/{user_id}": {
      "delete": {
        "summary": "Delete token by user id",
        "tags": ["Token"],
        "parameters": [
          {
            "name": "user_id",
            "in": "path",
            "required": True,
            "description": "User ObjectId",
            "schema": { "type": "string", "example": "699d0093795741a59fe13616" }
          }
        ],
        "responses": {
          "200": {
            "description": "Token deleted successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          },
          "404": {
            "description": "Token not found",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULtokens/delete/value/{token}": {
      "delete": {
        "summary": "Delete token by value",
        "tags": ["Token"],
        "parameters": [
          {
            "name": "token",
            "in": "path",
            "required": True,
            "description": "Token value",
            "schema": { "type": "string", "example": "some_token_value" }
          }
        ],
        "responses": {
          "200": {
            "description": "Token deleted successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          },
          "404": {
            "description": "Token not found",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULuserSettings/{user_id}": {
      "get": {
        "summary": "Get user settings",
        "tags": ["UserSettings"],
        "parameters": [
          {
            "name": "user_id",
            "in": "path",
            "required": True,
            "description": "User ObjectId",
            "schema": { "type": "string", "example": "699d0093795741a59fe13616" }
          }
        ],
        "responses": {
          "200": {
            "description": "User settings found",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          },
          "404": {
            "description": "Settings not found",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULuserSettings/create/{user_id}": {
      "post": {
        "summary": "Create user settings",
        "tags": ["UserSettings"],
        "parameters": [
          {
            "name": "user_id",
            "in": "path",
            "required": True,
            "description": "User ObjectId",
            "schema": { "type": "string", "example": "699d0093795741a59fe13616" }
          }
        ],
        "requestBody": {
          "required": False,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "settings": { "type": "object", "description": "Optional settings data" }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "User settings created successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          },
          "400": {
            "description": "Error creating settings",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULuserSettings/createDefault/{user_id}": {
      "post": {
        "summary": "Create default user settings",
        "tags": ["UserSettings"],
        "parameters": [
          {
            "name": "user_id",
            "in": "path",
            "required": True,
            "description": "User ObjectId",
            "schema": { "type": "string", "example": "699d0093795741a59fe13616" }
          }
        ],
        "responses": {
          "201": {
            "description": "Default user settings created successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          },
          "400": {
            "description": "Error creating default settings",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULuserSettings/update/{user_id}": {
      "put": {
        "summary": "Update user settings",
        "tags": ["UserSettings"],
        "parameters": [
          {
            "name": "user_id",
            "in": "path",
            "required": True,
            "description": "User ObjectId",
            "schema": { "type": "string", "example": "699d0093795741a59fe13616" }
          }
        ],
        "requestBody": {
          "required": True,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "data": { "type": "object", "description": "Settings data fields to update" }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "User settings updated successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          },
          "400": {
            "description": "Invalid input or update error",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULuserSettings/delete/{user_id}": {
      "delete": {
        "summary": "Delete user settings",
        "tags": ["UserSettings"],
        "parameters": [
          {
            "name": "user_id",
            "in": "path",
            "required": True,
            "description": "User ObjectId",
            "schema": { "type": "string", "example": "699d0093795741a59fe13616" }
          }
        ],
        "responses": {
          "200": {
            "description": "User settings deleted successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          },
          "404": {
            "description": "Settings not found",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULexercises/metadata": {
      "get": {
        "summary": "Get initial metadata for exercises (Page 1)",
        "tags": ["Exercises"],
        "responses": {
          "200": {
            "description": "Initial metadata for exercises pagination",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          },
          "500": {
            "description": "Server error",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "summary": "Get next or previous page of metadata",
        "description": "Use the 'search' query parameter with value 'next' for next page or 'prev' for previous page. Pass the current page data in the request body.",
        "tags": ["Exercises"],
        "parameters": [
          {
            "name": "search",
            "in": "query",
            "required": True,
            "description": "Pagination direction: 'next' for next page, 'prev' for previous page",
            "schema": { "type": "string", "enum": ["next", "prev"], "example": "next" }
          }
        ],
        "requestBody": {
          "required": True,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "description": "Current page data for pagination",
                "example": { "currentPage": 1 }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Metadata for requested page",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          },
          "400": {
            "description": "Invalid search query or no page data provided",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string", "example": "Invalid search query" }
                  }
                }
              }
            }
          },
          "500": {
            "description": "Server error",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULexercises/": {
      "post": {
        "summary": "Get next or previous page of exercises",
        "description": "Use the 'search' query parameter with value 'next' for next page or 'prev' for previous page. Pass the current page data in the request body.",
        "tags": ["Exercises"],
        "parameters": [
          {
            "name": "search",
            "in": "query",
            "required": True,
            "description": "Pagination direction: 'next' for next page, 'prev' for previous page",
            "schema": { "type": "string", "enum": ["next", "prev"], "example": "next" }
          }
        ],
        "requestBody": {
          "required": True,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "description": "Current page data for pagination",
                "example": { "currentPage": 1 }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Exercises for requested page",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "_id": { "type": "string", "example": "698d0bc06e5117c22dd7774b" },
                      "name": { "type": "string", "example": "Dumbbell Bench Press" },
                      "muscle_group": { "type": "string", "example": "Chest" },
                      "difficulty": { "type": "string", "example": "Intermediate" },
                      "equipment": { "type": "string", "example": "Dumbbells, Flat Bench" },
                      "instructions": { "type": "string", "example": "Lie on a flat bench..." },
                      "type": { "type": "string", "example": "Strength" }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Invalid search query or no page data provided",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string", "example": "Invalid search query" }
                  }
                }
              }
            }
          },
          "500": {
            "description": "Server error",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULexercises/{exercise_id}": {
      "put": {
        "summary": "Update an exercise",
        "tags": ["Exercises"],
        "parameters": [
          {
            "name": "exercise_id",
            "in": "path",
            "required": True,
            "description": "Exercise ObjectId",
            "schema": { "type": "string", "example": "698d0bc06e5117c22dd7774b" }
          }
        ],
        "requestBody": {
          "required": True,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "name": { "type": "string", "example": "Barbell Back Squat" },
                  "muscle_group": { "type": "string", "example": "Legs" },
                  "difficulty": { "type": "string", "example": "Intermediate" },
                  "equipment": { "type": "string", "example": "Barbell, Squat Rack" },
                  "instructions": { "type": "string", "example": "Position the barbell..." },
                  "type": { "type": "string", "example": "Strength" }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Exercise updated successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": { "type": "string", "example": "Exercise updated successfully" }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Invalid input or update error",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/AHFULworkout/create/template": {
      "post": {
        "summary": "Create a workout template",
        "tags": ["Workout"],
        "requestBody": {
          "required": True,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["userId"],
                "properties": {
                  "userId": { "type": "string", "example": "699d0093795741a59fe13616" },
                  "title": { "type": "string", "example": "My Workout Template" }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Workout template created successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "workout_id": { "type": "string", "example": "698d039a6e5117c22dd7771d" },
                    "message": { "type": "string", "example": "Workout created" }
                  },
                  "required": ["workout_id", "message"]
                }
              }
            }
          },
          "400": {
            "description": "Invalid input or creation error",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    }


  }
}