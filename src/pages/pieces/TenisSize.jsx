import PieceSizeForm from '../../components/PieceSizeForm'
import { PIECE_KEYS } from '../../constants/roles'

export default function TenisSize() {
  return (
    <PieceSizeForm
      title="Cadastro de tênis"
      sizeLabel="Tamanho do tênis"
      pieceKey={PIECE_KEYS.TENIS}
      mode="shoe"
    />
  )
}
