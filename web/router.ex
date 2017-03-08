defmodule Filetracker.Router do
  use Filetracker.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", Filetracker do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
  end

  scope "/api", Filetracker do
    post "open", ApiController, :open
    get "files", ApiController, :files
    get "data", ApiController, :data
    post "update", ApiController, :update
  end

  # Other scopes may use custom stacks.
  # scope "/api", Filetracker do
  #   pipe_through :api
  # end
end
