defmodule Filetracker.ApiController do
  use Filetracker.Web, :controller
  import Filetracker.Util  
  
  def open(conn, params) do
    %{"file" => file} = params
    # amazing, Path.join doesn't handle this correctly to make this work on windows
    System.cmd("explorer.exe", [dir() <> "\\" <> file])
    json conn, :ok
  end

  def files(conn, _params) do
    json conn, ls_sorted!()
  end

  def data(conn, _params) do
    json conn, get_data()
  end

  def update(conn, params) do
    %{"file" => file, "watched" => watched} = params
    update_data file, watched
    data conn, params
  end
end
