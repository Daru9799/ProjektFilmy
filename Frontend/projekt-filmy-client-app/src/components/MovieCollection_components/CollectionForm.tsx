import React from "react";

type Props = {
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  shareMode: number;
  setShareMode: (val: number) => void;
  allowCopy: boolean;
  setAllowCopy: (val: boolean) => void;
};

const CollectionForm: React.FC<Props> = ({
  title,
  setTitle,
  description,
  setDescription,
  shareMode,
  setShareMode,
  allowCopy,
  setAllowCopy,
}) => {
  return (
    <div className="form-grid">
      <div className="form-left">
        <div>
          <label>Tytuł:</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <label style={{ marginTop: "10%" }}>Tryb udostępniania:</label>
          <select value={shareMode} onChange={(e) => setShareMode(Number(e.target.value))}>
            <option value={0}>Prywatna</option>
            <option value={1}>Tylko znajomi</option>
            <option value={2}>Publiczna</option>
          </select>
        </div>

        <div className="checkbox-row">
          <label style={{ marginTop: "10%", marginLeft: "30%" }}>Pozwól na kopiowanie</label>
          <input
            type="checkbox"
            checked={allowCopy}
            style={{ marginTop: "13%" }}
            onChange={(e) => setAllowCopy(e.target.checked)}
          />
        </div>
      </div>

      <div className="form-right">
        <label>Opis:</label>
        <textarea
            style={{
                marginLeft: "5%",
                width: "90%",
                maxHeight: "275px", 
                overflowY: "auto",
                resize: "vertical" 
            }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            />
      </div>
    </div>
  );
};

export default CollectionForm;
