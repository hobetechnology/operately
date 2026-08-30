defmodule Operately.Repo.Migrations.AddStartDateToTasks do
  use Ecto.Migration

  def change do
    alter table(:tasks) do
      add :start_date, :map
    end
  end
end
