import PieceSizeForm from '../../components/PieceSizeForm'
import { PIECE_KEYS } from '../../constants/roles'

export default function BermudaSize() {
  return (
    <PieceSizeForm
      title="Cadastro de bermuda"
      sizeLabel="Tamanho da bermuda"
      pieceKey={PIECE_KEYS.BERMUDA}
    />
  )
}
