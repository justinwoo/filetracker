defmodule Filetracker.Util do

  def dir do
    System.get_env "FILETRACKER_DIR"
  end

  def filetracker_data do
    Path.join dir(), "filetracker.data"
  end

  def create_data do
    write_data Map.new
    get_data()
  end

  def write_data(dict) do
    File.write! filetracker_data(), :erlang.term_to_binary(dict)
  end

  def get_data do
    case File.read filetracker_data() do
      {:ok, bin} -> :erlang.binary_to_term bin
      {:error, :enoent} -> create_data()
    end
  end

  def update_data(file, watched) do
    Map.update(get_data(), file, watched, fn _ -> watched end)
    |> write_data
  end

  def ls_sorted!() do
    File.ls!(dir())
    |> Enum.map(fn x ->
      path = Path.join dir(), x
      stat = File.stat! path, []
      {x, stat.mtime}
    end)
    |> Enum.sort(&(elem(&1, 1) > elem(&2, 1)))
    |> Enum.map(&(elem &1, 0))
  end
end
