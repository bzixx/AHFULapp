from flask import jsonify                             # Use Flask to import Python Code as JSON
from flask_swagger_ui import get_swaggerui_blueprint  #Import swagger from Python Package.

swaggerAHFULDocsURL = '/APIDocs'                              # URL for exposing Swagger UI
configDocURL = 'http://localhost:5000/APIDocs/swagger.json'   #URL for the Backend Configuration for the UI
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
    { "url": "/Backend" }
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
            "required": "true",
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
            "required": "true",
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
                  "required": ["userId"],
                  "properties": {
                    "userId":    { "type": "string", "description": "User ObjectId", "example": "699d0093795741a59fe13616" },
                    "exerciseId":{ "type": "string", "description": "Exercise ObjectId (if applicable)", "example": "698d0bc06e5117c22dd7774b" },
                    "workoutId": { "type": "string", "description": "Workout ObjectId (if applicable)",  "example": "699d05d8f1677119323250bc" },
                    "reps":      { "type": "integer", "example": 1 },
                    "sets":      { "type": "integer", "example": 1 },
                    "weight":    { "type": "string",  "example": "135" },
                    "duration":  { "type": "number",  "example": 0 },
                    "distance":  { "type": "string",  "example": "0" },
                    "complete":  { "type": "boolean", "example": True }
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
                      "personal_ex_id": { "type": "string", "example": "698d07b26e5117c22dd7772e" },
                      "message": { "type": "string", "example": "Personal Ex created" }
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
                  "schema": { "type": "object", "properties": { "error": { "type": "string" } } }
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
            "required": "true",
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

    "/AHFULworkout/id/{id}": {
      "get": {
        "summary": "Get workout by id",
        "tags": ["Workout"],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": "true",
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
          "required": "true",
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
    
    "/AHFULgym/": {
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
    
    "/AHFULgym/{gym_id}": {
      "get": {
        "summary": "Get gym by id",
        "tags": ["Gym"],
        "parameters": [
          {
            "name": "gym_id",
            "in": "path",
            "required": "true",
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
    
    "/AHFULgym/create": {
      "post": {
        "summary": "Create a new gym",
        "tags": ["Gym"],
        "requestBody": {
          "required": "true",
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
    
    "/AHFULgym/delete/{gym_id}": {
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
            "required": "true",
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
            "required": "true",
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
          "required": "true",
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

    "/AHFULfood/delete/{food_d}": {
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
    }
  }
}
    


