import PieceSizeForm from '../../components/PieceSizeForm'
import { PIECE_KEYS } from '../../constants/roles'

export default function CalcaSize() {
  return (
    <PieceSizeForm
      title="Cadastro de calça"
      sizeLabel="Tamanho da calça"
      pieceKey={PIECE_KEYS.CALCA}
    />
  )
}
