import PieceSizeForm from '../../components/PieceSizeForm'
import { PIECE_KEYS } from '../../constants/roles'

export default function JaquetaSize() {
  return (
    <PieceSizeForm
      title="Cadastro de jaqueta"
      sizeLabel="Tamanho da jaqueta"
      pieceKey={PIECE_KEYS.JAQUETA}
    />
  )
}
