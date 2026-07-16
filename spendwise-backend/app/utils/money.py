from decimal import Decimal
from decimal import ROUND_HALF_UP


def round_money(
    amount: Decimal,
) -> Decimal:

    return amount.quantize(
        Decimal("0.01"),
        rounding=ROUND_HALF_UP,
    )